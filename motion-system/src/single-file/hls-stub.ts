/**
 * Stub for the single-file build.
 *
 * The self-contained HTML has no network of its own: everything is inlined, so
 * an HLS manifest split across segment files cannot exist. Rather than bundling
 * 523KB of hls.js that could never be used, the single-file build aliases the
 * library to this.
 *
 * It reports "not supported", which is not a lie in that context and which
 * sends HlsVideo down the third branch it already documents: the progressive
 * <source> list. So the video still plays, from the inlined webm and mp4.
 */
class HlsStub {
  static isSupported() {
    return false;
  }
  static Events = { MANIFEST_PARSED: 'hlsManifestParsed' } as const;
  loadSource() {}
  attachMedia() {}
  on() {}
  destroy() {}
}

export default HlsStub;
