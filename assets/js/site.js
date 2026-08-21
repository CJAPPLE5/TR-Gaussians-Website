(function () {
  const rtrMethods = [
    ['gt', 'GT'],
    ['ours', 'Ours'],
    ['specgs', 'Spec-Gaussian'],
    ['envgs', 'EnvGS'],
    ['3dgs', '3DGS'],
  ];
  const mirrorNerfMethods = [
    ['gt', 'GT'],
    ['ours', 'Ours'],
    ['mirrornerf', 'Mirror-NeRF'],
    ['specgs', 'Spec-Gaussian'],
    ['envgs', 'EnvGS'],
    ['3dgs', '3DGS'],
  ];
  const qualitativeScenes = [
    ['bookcase1', 'RTR: Bookcase1', rtrMethods],
    ['paint', 'RTR: Ship', rtrMethods],
    ['discussion_room', 'Mirror-NeRF: Discussion Room', mirrorNerfMethods],
    ['lounge', 'Mirror-NeRF: Lounge', mirrorNerfMethods],
  ];
  const comparisonSet = document.querySelector('[data-comparison-set]');
  if (comparisonSet) {
    comparisonSet.innerHTML = qualitativeScenes.map(([key, name, sceneMethods]) => `
      <section class="comparison-scene" aria-labelledby="${key}-title">
        <h3 id="${key}-title">${name}</h3>
        <div class="multi-comparison" data-multi-comparison aria-label="Method comparison for ${name}">
          ${sceneMethods.map(([method, label]) => `<img src="assets/images/comparisons/${key}/${method}.png" alt="${label} result for ${name}">`).join('')}
          ${sceneMethods.map(([method, label]) => `<span class="method-label ${method === 'ours' ? 'ours-label' : ''}" data-method-label>${label}</span>`).join('')}
          ${sceneMethods.slice(0, -1).map(([, label], index) => `<button class="multi-divider" type="button" data-divider aria-label="Move divider ${index + 1}, after ${label}"></button>`).join('')}
        </div>
      </section>`).join('');
  }
  document.querySelectorAll('[data-teaser-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    let moving = false;
    const step = () => {
      const gap = window.matchMedia('(max-width: 600px)').matches ? 6 : 12;
      const card = track.children[0];
      return card.getBoundingClientRect().width + gap;
    };
    const reset = () => {
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';
      track.getBoundingClientRect();
      track.style.transition = '';
    };
    track.addEventListener('transitionend', (event) => {
      if (event.target !== track || event.propertyName !== 'transform') return;
      if (track.dataset.direction === 'right') track.append(track.firstElementChild);
      reset();
      moving = false;
    });
    carousel.querySelector('[data-carousel-previous]').addEventListener('click', () => {
      if (moving) return;
      moving = true;
      track.dataset.direction = 'left';
      track.prepend(track.lastElementChild);
      track.style.transition = 'none';
      track.style.transform = `translateX(${-step()}px)`;
      track.getBoundingClientRect();
      track.style.transition = '';
      track.style.transform = 'translateX(0)';
    });
    carousel.querySelector('[data-carousel-next]').addEventListener('click', () => {
      if (moving) return;
      moving = true;
      track.dataset.direction = 'right';
      track.style.transform = `translateX(${-step()}px)`;
    });
    window.addEventListener('resize', reset);
    reset();
  });

  document.querySelectorAll('[data-multi-comparison]').forEach((comparison) => {
    const images = Array.from(comparison.querySelectorAll('img'));
    const labels = Array.from(comparison.querySelectorAll('[data-method-label]'));
    const dividers = Array.from(comparison.querySelectorAll('[data-divider]'));
    const boundaries = Array.from({ length: images.length + 1 }, (_, index) => (index * 100) / images.length);
    const minWidth = 0;
    const render = () => {
      images.forEach((image, index) => {
        image.style.clipPath = `inset(0 ${100 - boundaries[index + 1]}% 0 ${boundaries[index]}%)`;
        labels[index].style.left = `${(boundaries[index] + boundaries[index + 1]) / 2}%`;
        labels[index].hidden = boundaries[index + 1] - boundaries[index] < 9;
      });
      dividers.forEach((divider, index) => { divider.style.left = `${boundaries[index + 1]}%`; });
    };
    const update = (index, clientX) => {
      const rect = comparison.getBoundingClientRect();
      const value = ((clientX - rect.left) / rect.width) * 100;
      boundaries[index + 1] = Math.min(100, Math.max(0, value));
      for (let position = index; position >= 0; position -= 1) boundaries[position] = Math.min(boundaries[position], boundaries[position + 1] - minWidth);
      for (let position = index + 2; position < boundaries.length; position += 1) boundaries[position] = Math.max(boundaries[position], boundaries[position - 1] + minWidth);
      render();
    };
    dividers.forEach((divider, index) => {
      divider.addEventListener('pointerdown', (event) => { divider.setPointerCapture(event.pointerId); update(index, event.clientX); });
      divider.addEventListener('pointermove', (event) => { if (divider.hasPointerCapture(event.pointerId)) update(index, event.clientX); });
      divider.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const delta = event.key === 'ArrowLeft' ? -2 : 2;
        update(index, comparison.getBoundingClientRect().left + ((boundaries[index + 1] + delta) / 100) * comparison.getBoundingClientRect().width);
      });
    });
    render();
  });
}());
