"use client"

import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"
import Image from "next/image"
import "quill/dist/quill.snow.css"
import { Delta, Op } from "quill/core"
import { MdSend } from "react-icons/md"
import { PiTextAa } from "react-icons/pi"
import Quill, { type QuillOptions } from "quill"
import { ImageIcon, Smile, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"
import { EmojiPopover } from "@/components/emoji-popover"

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
  const [image, setImage] = useState<File | null>(null)
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true)

  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill | null>(null)
  const defaultValueRef = useRef(defaultValue)
  const containerRef = useRef<HTMLDivElement>(null)
  const disabledRef = useRef(disabled)
  const imageElementRef = useRef<HTMLInputElement>(null)

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
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          ["clean"]
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText()
                const addedImage = imageElementRef.current?.files?.[0] || null

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0

                if (isEmpty) return

                const body = JSON.stringify(quill.getContents())
                submitRef.current?.({ body, image: addedImage })
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

  const onEmojiSelect = (emoji: string) => {
    const quill = quillRef.current

    quill?.insertText(quill?.getSelection()?.index || 0, emoji)
  }

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0

  const isMac = () => {
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0
  }

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={imageElementRef}
        onChange={(e) => setImage(e.target.files![0])}
      />
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-sm",
          disabled && "opacity-50"
        )}
      >
        <div ref={containerRef} className="ql-custom h-full" />
        {!!image && (
          <div className="p-2">
            <div className="group/image relative flex size-[62px] items-center justify-center">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null)
                    imageElementRef.current!.value = ""
                  }}
                  className="absolute -right-2.5 -top-2.5 z-[4] hidden size-6 items-center justify-center rounded-full border-2 border-white bg-black/75 text-white hover:bg-black group-hover/image:flex"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                fill
                alt="Uploaded"
                src={URL.createObjectURL(image)}
                className="overflow-hidden rounded-xl border object-cover"
              />
            </div>
          </div>
        )}
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
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button size="iconSm" variant="ghost" disabled={disabled}>
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                size="iconSm"
                variant="ghost"
                disabled={disabled}
                onClick={() => imageElementRef?.current?.click()}
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
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image
                  })
                }}
                className="bg-[#007A5A] text-white hover:bg-[#007A5A]/80"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button
              size="iconSm"
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image
                })
              }}
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
      {variant === "create" && (
        <div
          className={cn(
            "flex justify-end p-2 text-[10px] text-muted-foreground opacity-0 transition",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + {isMac() ? "Return" : "Enter"}</strong> to add a new
            line
          </p>
        </div>
      )}
    </div>
  )
}

export default Editor
