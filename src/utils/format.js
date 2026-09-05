// Lightweight formatter for assistant responses.
// Renders **bold**, `inline code`, and ``` fenced code blocks without a markdown library.
// All HTML is escaped first to keep it safe.

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function inlineFormat(escaped) {
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-800 dark:text-slate-100">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[0.85em] text-emerald-300 dark:bg-slate-700 dark:text-emerald-300">$1</code>')
}

export function formatAssistantMessage(message) {
  const escaped = escapeHtml(message)
  const blocks = escaped.split('```')
  let html = ''
  let inCode = false

  blocks.forEach((block, i) => {
    if (inCode) {
      let code = block.replace(/^[^\n]*\n/, '') // strip language hint line
      html += `<pre class="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-3.5 text-sm leading-relaxed text-slate-100"><code>${code.trim()}</code></pre>`
      inCode = false
    } else {
      const text = inlineFormat(block)
        .replace(/\n/g, '<br/>')
      html += `<span class="inline">${text}</span>`
      if (i < blocks.length - 1) {
        inCode = true
      }
    }
  })

  return html
}