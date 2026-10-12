/**
 * 监听 PDF 滚动到底部（兼容单页）
 * @param {Pdfh5} pdfh5Instance - pdfh5 实例
 * @param {Function} onBottom - 触底回调
 * @param {number} stayTime - 单页无滚动时的停留时间（ms，默认0）
 */
function watchPdfBottom(pdfh5Instance, onBottom, stayTime = 0) {
  let isSinglePage = false;
  let scrollListenerAdded = false;
  let hasTriggered = false; // 防止重复触发

  const checkScrollBottom = (viewer) => {
    const { scrollTop, scrollHeight, clientHeight } = viewer;
    return scrollTop + clientHeight >= scrollHeight - 10; // 10px 阈值
  };

  const handleScroll = () => {
    if (hasTriggered) return;
    const viewer = document.querySelector('.pdfViewer');
    if (!viewer) return;

    if (checkScrollBottom(viewer)) {
      hasTriggered = true;
      onBottom();
    }
  };

  pdfh5Instance.on('loaded', function (pdf) {
    isSinglePage = pdf.totalNum === 1;
    const viewer = document.querySelector('.pdfViewer');
    if (!viewer) return;

    // 单页场景
    if (isSinglePage) {
      // 判断是否有滚动条
      const hasScroll = viewer.scrollHeight > viewer.clientHeight;

      if (hasScroll) {
        // 有滚动条：监听滚动
        viewer.addEventListener('scroll', handleScroll, { passive: true });
        scrollListenerAdded = true;
      } else {
        // 无滚动条：无需滚动，直接触发（可加停留时间）
        setTimeout(() => {
          if (!hasTriggered) {
            hasTriggered = true;
            onBottom();
          }
        }, stayTime);
      }
    } else {
      // 多页场景：直接监听滚动
      viewer.addEventListener('scroll', handleScroll, { passive: true });
      scrollListenerAdded = true;
    }
  });

  // 返回清理函数
  return () => {
    const viewer = document.querySelector('.pdfViewer');
    if (viewer && scrollListenerAdded) {
      viewer.removeEventListener('scroll', handleScroll);
    }
  };
}