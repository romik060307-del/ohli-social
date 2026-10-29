#!/usr/bin/env node
/**
 * Non-production end-to-end smoke test for the Android-hosted OHLI API.
 * Uses two existing disposable accounts and removes created posts at the end.
 */
const base = (process.env.OHLI_BASE_URL || 'http://127.0.0.1:8080').replace(/\/+$/, '');
const phoneA = String(process.env.OHLI_PHONE_A || '').replace(/\D/g, '');
const passA = process.env.OHLI_PASSWORD_A || '';
const phoneB = String(process.env.OHLI_PHONE_B || '').replace(/\D/g, '');
const passB = process.env.OHLI_PASSWORD_B || '';

if (!phoneA || !passA || !phoneB || !passB) {
  console.error('Isi OHLI_PHONE_A, OHLI_PASSWORD_A, OHLI_PHONE_B, dan OHLI_PASSWORD_B untuk dua akun uji.');
  process.exit(2);
}
if (phoneA === phoneB) {
  console.error('Akun A dan B harus berbeda.');
  process.exit(2);
}

let passed = 0;
const createdPostsA = [];
let tokenA = '';
let tokenB = '';
const unique = 'OHLI_SMOKE_' + Date.now().toString(36).toUpperCase();

async function request(path, {method = 'GET', token, body, allowStatuses = []} = {}) {
  const url = new URL(path, base);
  if (method === 'GET' && token) url.searchParams.set('token', token);
  const headers = {Accept: 'application/json'};
  const config = {method, headers};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
    config.body = JSON.stringify({...body, ...(token ? {token} : {})});
  }
  let response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    throw new Error(`Tidak dapat menghubungi ${base}: ${error.message}`);
  }
  let data = {};
  try { data = await response.json(); } catch { /* non-JSON response checked below */ }
  if (!response.ok && !allowStatuses.includes(response.status)) {
    throw new Error(`${method} ${path} => HTTP ${response.status}: ${data.error || 'respons bukan JSON sukses'}`);
  }
  if (response.ok && data.ok === false && !allowStatuses.includes(response.status)) {
    throw new Error(`${method} ${path} => ${data.error || 'API mengembalikan ok:false'}`);
  }
  return {status: response.status, data};
}
function check(ok, message) {
  if (!ok) throw new Error(message);
  passed++;
  console.log(`PASS ${passed}: ${message}`);
}
async function login(phone, password) {
  const {data} = await request('/api/login', {method: 'POST', body: {phone, password}});
  if (!data.token) throw new Error('Login berhasil tetapi respons tidak berisi token.');
  return data.token;
}
async function createPost(token, text, audience = 'public') {
  const {data} = await request('/api/posts', {method: 'POST', token, body: {text, audience}});
  if (!data.post?.id) throw new Error('API tidak mengembalikan ID postingan baru.');
  if (token === tokenA) createdPostsA.push(data.post.id);
  return data.post;
}

try {
  const {data: health} = await request('/health');
  check(health.ok === true, 'health endpoint menjawab OK');
  tokenA = await login(phoneA, passA);
  tokenB = await login(phoneB, passB);
  check(Boolean(tokenA && tokenB && tokenA !== tokenB), 'dua akun berbeda dapat login');

  const noToken = await request('/api/feed', {allowStatuses: [401]});
  check(noToken.status === 401, 'endpoint feed menolak sesi tanpa token');

  const publicPost = await createPost(tokenA, `${unique}_PUBLIC`, 'public');
  const privatePost = await createPost(tokenA, `${unique}_PRIVATE`, 'private');
  const feedB = (await request('/api/feed?mode=public', {token: tokenB})).data.posts || [];
  check(feedB.some(p => p.id === publicPost.id), 'posting publik akun A terlihat oleh akun B');
  check(!feedB.some(p => p.id === privatePost.id), 'posting privat akun A tidak terlihat pada feed akun B');

  const profileB = (await request(`/api/profile?phone=${encodeURIComponent(phoneA)}`, {token: tokenB})).data;
  check((profileB.posts || []).some(p => p.id === publicPost.id), 'profil menampilkan postingan yang boleh dilihat');
  check(!(profileB.posts || []).some(p => p.id === privatePost.id), 'profil tidak membocorkan postingan privat');

  const crossEdit = await request('/api/posts/edit', {method: 'POST', token: tokenB, body: {postId: publicPost.id, text: 'UNAUTHORIZED_EDIT', audience: 'public'}, allowStatuses: [403]});
  check(crossEdit.status === 403, 'akun B tidak dapat mengedit postingan milik akun A');
  const crossArchive = await request('/api/posts/archive', {method: 'POST', token: tokenB, body: {postId: publicPost.id, action: 'archive'}, allowStatuses: [403]});
  check(crossArchive.status === 403, 'akun B tidak dapat mengarsipkan postingan milik akun A');
  const crossDelete = await request('/api/posts/delete', {method: 'POST', token: tokenB, body: {postId: publicPost.id}, allowStatuses: [403]});
  check(crossDelete.status === 403, 'akun B tidak dapat menghapus postingan milik akun A');

  const liked = (await request('/api/posts/like', {method: 'POST', token: tokenB, body: {postId: publicPost.id}})).data;
  check(liked.liked === true, 'like dapat ditambahkan oleh akun B');
  const unliked = (await request('/api/posts/like', {method: 'POST', token: tokenB, body: {postId: publicPost.id}})).data;
  check(unliked.liked === false, 'like dapat dibatalkan oleh akun B');

  const comment = (await request('/api/posts/comment', {method: 'POST', token: tokenB, body: {postId: publicPost.id, text: `${unique}_COMMENT`}})).data;
  check(Boolean(comment.comment?.id), 'komentar tersimpan pada postingan');

  const saved = (await request('/api/posts/bookmark', {method: 'POST', token: tokenB, body: {postId: publicPost.id}})).data;
  check(saved.saved === true, 'bookmark pribadi dapat dibuat');
  const savedList = (await request('/api/posts/saved', {token: tokenB})).data.posts || [];
  check(savedList.some(p => p.id === publicPost.id), 'bookmark muncul di daftar tersimpan milik akun B');
  const unsaved = (await request('/api/posts/bookmark', {method: 'POST', token: tokenB, body: {postId: publicPost.id}})).data;
  check(unsaved.saved === false, 'bookmark dapat dihapus');

  const follow = (await request('/api/follow', {method: 'POST', token: tokenB, body: {target: phoneA, action: 'follow'}})).data;
  check(follow.following === true, 'akun B dapat mengikuti akun A');
  const unfollow = (await request('/api/follow', {method: 'POST', token: tokenB, body: {target: phoneA, action: 'unfollow'}})).data;
  check(unfollow.following === false, 'akun B dapat berhenti mengikuti akun A');

  // Verify archive/restore persistence, then restore so no test post remains hidden.
  const archive = (await request('/api/posts/archive', {method: 'POST', token: tokenA, body: {postId: publicPost.id, action: 'archive'}})).data;
  check(archive.archived === true, 'pemilik dapat mengarsipkan postingan');
  const archiveList = (await request('/api/posts/archive', {token: tokenA})).data.posts || [];
  check(archiveList.some(p => p.id === publicPost.id), 'postingan ada pada arsip privat pemilik');
  const restore = (await request('/api/posts/archive', {method: 'POST', token: tokenA, body: {postId: publicPost.id, action: 'restore'}})).data;
  check(restore.archived === false, 'pemilik dapat memulihkan postingan dari arsip');

  console.log(`\nBerhasil: ${passed} pemeriksaan API.`);
} catch (error) {
  console.error(`\nGAGAL setelah ${passed} pemeriksaan: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (tokenB) {
    // Remove any test-post bookmarks left behind if a check failed midway.
    try {
      const savedPosts = (await request('/api/posts/saved', {token: tokenB})).data.posts || [];
      for (const id of createdPostsA) {
        if (savedPosts.some(post => post.id === id)) {
          await request('/api/posts/bookmark', {method: 'POST', token: tokenB, body: {postId: id}});
        }
      }
    } catch { /* cleanup is best-effort if server connectivity is lost */ }
  }
  if (tokenA) {
    for (const id of createdPostsA) {
      try { await request('/api/posts/archive', {method: 'POST', token: tokenA, body: {postId: id, action: 'restore'}}); } catch {}
      try { await request('/api/posts/delete', {method: 'POST', token: tokenA, body: {postId: id}}); } catch {}
    }
  }
}
