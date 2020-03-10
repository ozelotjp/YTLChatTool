const DOM = {
  YTL_CHAT_APP: 'yt-live-chat-app',
  YTL_CHAT_AUTHOR_NAME: '#author-name',
  YTL_CHAT_MESSAGES: '#message',
  YTL_CHAT_TEXT_MESSAGE: 'yt-live-chat-text-message-renderer',
  YTL_CHAT_PAID_MESSAGE: 'yt-live-chat-paid-message-renderer'
}

const TYPE = {
  AUTHOR_NAME: 'authorName',
  MESSAGE: 'message'
}

const block = [
  {
    type: TYPE.AUTHOR_NAME,
    word: 'オ',
    regex: false
  },
  {
    type: TYPE.MESSAGE,
    word: 'ちゃおん！',
    regex: false
  }
]

function constructor() {
  const target = document.querySelector(DOM.YTL_CHAT_APP) as HTMLDivElement
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        const commentElement = node as HTMLDivElement
        if (isHiddenComment(commentElement)) {
          commentElement.hidden = true
        }
      })
    })
  })
  observer.observe(target, {
    childList: true,
    subtree: true
  })
}

function isChatMessageDom(element: HTMLDivElement) {
  const type = element.nodeName.toLowerCase()
  return type === DOM.YTL_CHAT_TEXT_MESSAGE || type === DOM.YTL_CHAT_PAID_MESSAGE
}

function getAuthorName(element: HTMLDivElement) {
  const authorNameElement = element.querySelector(DOM.YTL_CHAT_AUTHOR_NAME) as HTMLDivElement
  return authorNameElement.textContent!.trim()
}

function getMessage(element: HTMLDivElement) {
  const messagesElement = element.querySelector(DOM.YTL_CHAT_MESSAGES) as Node
  let message = ''
  messagesElement.childNodes.forEach((childNode) => {
    const messageElement = childNode as Node
    if (messageElement.nodeType === Node.TEXT_NODE) {
      // eslint-disable-next-line all
      message += messageElement.wholeText
    }
    if (messageElement.nodeType === Node.ELEMENT_NODE) {
      if (
        messageElement.nodeName.toLowerCase() === 'img' &&
        typeof messageElement.alt === 'string'
      ) {
        message += messageElement.alt
      }
    }
  })
  return message
}

function isOwnMembership(element: HTMLDivElement) {
  const authorNameElement = element.querySelector(DOM.YTL_CHAT_AUTHOR_NAME) as HTMLDivElement
  return authorNameElement.classList.contains('member')
}

function isHiddenComment(element: HTMLDivElement) {
  if (isChatMessageDom(element) === false) {
    return
  }

  const authorName = getAuthorName(element)
  const message = getMessage(element)

  block.forEach((pattern) => {
    const target = pattern.type === TYPE.AUTHOR_NAME ? authorName : message
    if (
      pattern.regex
        ? new RegExp(pattern.word).test(target)
        : target.includes(pattern.word)
    ) {
      return true
    }
  })
  return false
}

constructor()
