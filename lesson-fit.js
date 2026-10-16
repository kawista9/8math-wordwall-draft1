(() => {
  const workspace = document.getElementById('workspaceView');
  const viewer = document.getElementById('lessonViewer');
  const image = document.getElementById('lessonImage');
  const shelf = document.getElementById('videoShelf');
  const navigation = document.getElementById('lessonNavigation');
  const area = viewer.parentElement;
  // Put actions first in both the visual order and keyboard order.
  area.insertBefore(shelf, viewer);
  area.insertBefore(navigation, viewer);
  for (const lab of document.querySelectorAll('.standards-lab, .transform-lab')) {
    const videos = lab.querySelector('.lab-video-coach');
    const heading = lab.querySelector('.standards-lab-header, .lab-heading');
    if (videos && heading) heading.after(videos);
  }
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'chart-size-toggle';
  button.textContent = 'Enlarge chart';
  button.setAttribute('aria-pressed', 'false');
  document.querySelector('.lesson-toolbar').append(button);
  let enlarged = false, pending = false;
  function fit() {
    pending = false;
    const open = workspace.classList.contains('is-active');
    document.body.classList.toggle('lesson-open', open);
    button.hidden = viewer.hidden || !open;
    if (!open || viewer.hidden) return;
    if (enlarged || innerWidth < 1000 || innerHeight < 650 || !image.naturalWidth) {
      viewer.style.removeProperty('width');
      return;
    }
    const available = Math.max(180, innerHeight - (viewer.getBoundingClientRect().top + scrollY) - 28);
    const width = Math.floor(available * image.naturalWidth / image.naturalHeight);
    const value = 'min(100%, ' + width + 'px)';
    if (viewer.style.width !== value) viewer.style.width = value;
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(fit); }
  }
  button.onclick = () => {
    enlarged = !enlarged;
    button.textContent = enlarged ? 'Fit chart to screen' : 'Enlarge chart';
    button.setAttribute('aria-pressed', String(enlarged));
    schedule();
  };
  image.addEventListener('load', schedule);
  window.addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(area);
  new MutationObserver(schedule).observe(workspace, {attributes:true,attributeFilter:['class']});
  new MutationObserver(schedule).observe(viewer, {attributes:true,attributeFilter:['hidden']});
  // Videos and resource labels differ in height between standards.
  new ResizeObserver(schedule).observe(shelf);
  new ResizeObserver(schedule).observe(document.getElementById('resourceTabs'));
  if (document.fonts) document.fonts.ready.then(schedule);
  schedule();
})();
