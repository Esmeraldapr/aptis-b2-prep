import { useEffect, useRef, useState } from 'react'

// Botón de "altavoz": lee el texto en voz alta usando la Web Speech API del
// navegador, en inglés (preferentemente con acento británico) para ayudar a
// personas con dislexia u otras dificultades de lectura.

let cachedVoice: SpeechSynthesisVoice | null = null

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  const british = voices.find((v) => v.lang === 'en-GB')
  if (british) return british
  const anyEnglish = voices.find((v) => v.lang?.toLowerCase().startsWith('en'))
  return anyEnglish ?? null
}

export function ListenButton({
  text,
  label = 'Escuchar',
  size = 'md',
}: {
  text: string
  label?: string
  size?: 'sm' | 'md'
}) {
  const [supported, setSupported] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false)
      return
    }
    function loadVoices() {
      cachedVoice = pickEnglishVoice()
    }
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [])

  useEffect(() => {
    // Si el componente se desmonta mientras habla (p. ej. al cambiar de
    // página), detenemos la lectura para que no siga sonando de fondo.
    return () => {
      if (utteranceRef.current) window.speechSynthesis?.cancel()
    }
  }, [])

  function handleClick() {
    if (!window.speechSynthesis) return

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = cachedVoice ?? pickEnglishVoice()
    if (voice) {
      cachedVoice = voice
      utterance.voice = voice
      utterance.lang = voice.lang
    } else {
      utterance.lang = 'en-GB'
    }
    utterance.rate = 0.92
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    utteranceRef.current = utterance
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  if (!supported || !text?.trim()) return null

  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={speaking ? 'Detener lectura en voz alta' : `Escuchar en voz alta, acento inglés: ${label}`}
      title={speaking ? 'Detener lectura' : 'Escuchar en voz alta (acento inglés)'}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border font-medium transition ${sizeClasses} ${
        speaking
          ? 'border-indigo-600 bg-indigo-600 text-white'
          : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
      }`}
    >
      <span aria-hidden="true">{speaking ? '⏹️' : '🔊'}</span>
      <span>{speaking ? 'Detener' : label}</span>
    </button>
  )
}
