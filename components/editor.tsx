"use client"

import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"
import "quill/dist/quill.snow.css"
import { Delta, Op } from "quill/core"
import { MdSend } from "react-icons/md"
import { PiTextAa } from "react-icons/pi"
import { ImageIcon, Smile } from "lucide-react"
import Quill, { type QuillOptions } from "quill"

import { cn } from "@/lib/utils"
import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"

type EditorValue = {
  image: File | null
  body: string
}

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void
  onCancel?: () => void
  placeholder?: string
  defaultValue?: Delta | Op[]
  disabled?: boolean
  innerRef?: MutableRefObject<Quill | null>
  variant?: "create" | "update"
}

const Editor = ({
  onSubmit,
  onCancel,
  placeholder = "Write something...",
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = "create"
}: EditorProps) => {
  const [text, setText] = useState("")
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)

  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill | null>(null)
  const defaultValueRef = useRef(defaultValue)
  const containerRef = useRef<HTMLDivElement>(null)
  const disabledRef = useRef(disabled)

  useLayoutEffect(() => {
    submitRef.current = onSubmit
    placeholderRef.current = placeholder
    defaultValueRef.current = defaultValue
    disabledRef.current = disabled
  })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    )

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          ["clean"]
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                // TODO: Submit form
                return
              }
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n")
              }
            }
          }
        }
      }
    }

    const quill = new Quill(editorContainer, options)
    quillRef.current = quill
    quillRef.current.focus()

    if (innerRef) {
      innerRef.current = quill
    }

    quill.setContents(defaultValueRef.current)
    setText(quill.getText())

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)

      if (container) {
        container.innerHTML = ""
      }
      if (quillRef.current) {
        quillRef.current = null
      }
      if (innerRef) {
        innerRef.current = null
      }
    }
  }, [innerRef])

  const toogleToolbar = () => {
    setIsToolbarVisible((current) => !current)
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar")

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden")
    }
  }

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0

  const isMac = () => {
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-sm">
        <div ref={containerRef} className="ql-custom h-full" />
        <div className="z-[5] flex px-2 pb-2">
          <Hint label={isToolbarVisible ? "Hide toolbar" : "Show toolbar"}>
            <Button
              size="iconSm"
              variant="ghost"
              disabled={disabled}
              onClick={toogleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={disabled}
              onClick={() => {}}
            >
              <Smile className="size-4" />
            </Button>
          </Hint>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                size="iconSm"
                variant="ghost"
                disabled={disabled}
                onClick={() => {}}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={() => {}}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={disabled || isEmpty}
                onClick={() => {}}
                className="bg-[#007A5A] text-white hover:bg-[#007A5A]/80"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button
              size="iconSm"
              onClick={() => {}}
              disabled={disabled || isEmpty}
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white text-muted-foreground hover:bg-white"
                  : "bg-[#007A5A] text-white hover:bg-[#007A5A]/80"
              )}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-end p-2 text-[10px] text-muted-foreground">
        <p>
          <strong>Shift + {isMac() ? "Return" : "Enter"}</strong> to add a new
          line
        </p>
      </div>
    </div>
  )
}

export default Editor
