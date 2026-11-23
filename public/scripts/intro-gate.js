/* Runs in <head> before first paint and before React hydrates. */

/* 1. Hosts can inject markup into <head> that React did not render (Netlify adds a
      promotional comment on *.netlify.app). React treats it as a hydration mismatch,
      so remove it before hydration starts. */
try {
  for (let node = document.head.firstChild; node; ) {
    const next = node.nextSibling;
    if (node.nodeType === Node.COMMENT_NODE && /netlify/i.test(node.data)) node.remove();
    node = next;
  }
  document.head
    .querySelectorAll('meta[name="hosting-provider"], meta[name="netlify-deploy"]')
    .forEach((meta) => meta.remove());
} catch {
  /* Nothing to clean up. */
}

/* 2. The opening sequence shows once per visit, on the home page, with motion allowed. */
try {
  if (
    sessionStorage.getItem('velune:intro') === 'seen' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    document.documentElement.dataset.intro = 'seen';
  }
} catch {
  document.documentElement.dataset.intro = 'seen';
}
