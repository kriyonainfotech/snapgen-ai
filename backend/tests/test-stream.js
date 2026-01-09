// const axios = require('axios');

// const BASE_URL = 'http://localhost:5000/api/ai'; // Adjust port if necessary
// const VIDEO_URL = 'https://res.aivio.art/videos/mock_video_output.mp4';
// const INVALID_URL = 'https://example.com/video.mp4';

// async function testStream() {
//     console.log("🚀 Starting verification tests...");

//     // 1. Test full stream (200 OK)
//     try {
//         console.log("\n1. Testing full stream...");
//         const res = await axios.get(`${BASE_URL}/stream?url=${encodeURIComponent(VIDEO_URL)}`);
//         console.log(`✅ Status: ${res.status}`);
//         console.log(`✅ Content-Type: ${res.headers['content-type']}`);
//         console.log(`✅ Accept-Ranges: ${res.headers['accept-ranges']}`);
//     } catch (e) {
//         console.error(`❌ Full stream failed: ${e.message}`);
//     }

//     // 2. Test range request (206 Partial Content)
//     try {
//         console.log("\n2. Testing range request (bytes=0-100)...");
//         const res = await axios.get(`${BASE_URL}/stream?url=${encodeURIComponent(VIDEO_URL)}`, {
//             headers: { 'Range': 'bytes=0-100' }
//         });
//         console.log(`✅ Status: ${res.status}`);
//         console.log(`✅ Content-Range: ${res.headers['content-range']}`);
//         console.log(`✅ Content-Length: ${res.headers['content-length']}`);
//     } catch (e) {
//         if (e.response && e.response.status === 206) {
//             console.log(`✅ Status: 206 (As expected)`);
//             console.log(`✅ Content-Range: ${e.response.headers['content-range']}`);
//         } else {
//             console.error(`❌ Range request failed: ${e.message}`);
//         }
//     }

//     // 3. Test SSRF protection (403 Forbidden)
//     try {
//         console.log("\n3. Testing SSRF protection (invalid domain)...");
//         await axios.get(`${BASE_URL}/stream?url=${encodeURIComponent(INVALID_URL)}`);
//         console.error("❌ SSRF test failed: Should have been forbidden");
//     } catch (e) {
//         if (e.response && e.response.status === 403) {
//             console.log("✅ SSRF protection working (403 Forbidden)");
//         } else {
//             console.error(`❌ SSRF test failed with unexpected error: ${e.message}`);
//         }
//     }
// }

// testStream();
