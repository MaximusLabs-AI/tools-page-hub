'use client'
import {useState} from 'react'

type C = {author: string; text: string; when: string}

const SAMPLE: C[] = [
  {
    author: 'Ava · SEO Lead',
    text: 'Switched our reporting to this for tracking ChatGPT mentions. The per-engine breakdown is what sold my team.',
    when: '2 weeks ago',
  },
  {
    author: 'Marcus · Agency owner',
    text: 'Solid value for mid-market clients. I do wish the white-label support was actually confirmed though.',
    when: '1 month ago',
  },
]

export default function Comments({toolName}: {toolName: string}) {
  const [signedIn, setSignedIn] = useState(false)
  const [items, setItems] = useState<C[]>(SAMPLE)
  const [text, setText] = useState('')

  const post = () => {
    const t = text.trim()
    if (!t) return
    setItems([{author: 'You', text: t, when: 'just now'}, ...items])
    setText('')
  }

  return (
    <div className="comments">
      {!signedIn ? (
        <div className="comments__signin">
          <div>
            <b>Join the conversation</b>
            <span>Sign in to leave a comment about {toolName}.</span>
          </div>
          <button className="btn btn--primary" onClick={() => setSignedIn(true)}>
            Sign in to comment
          </button>
        </div>
      ) : (
        <div className="comments__box">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Share your experience with ${toolName}…`}
            rows={3}
          />
          <button className="btn btn--primary" onClick={post}>Post comment</button>
        </div>
      )}

      <div className="comments__list">
        {items.map((c, i) => (
          <div className="cmt" key={i}>
            <span className="cmt__av">{c.author[0]}</span>
            <div>
              <div className="cmt__meta">
                <b>{c.author}</b> · {c.when}
              </div>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="foot-note">Demo comments (local only). Production comments require sign-in wiring.</p>
    </div>
  )
}
