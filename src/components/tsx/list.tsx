import { Children, ReactElement, ReactNode, cloneElement, isValidElement } from 'react'
import { motion } from 'framer-motion'

interface listProps {
    children: ReactNode,
    className?: string,
    hideScrollbar?: boolean,
    shadowGradient?: boolean
}

const List = ({ children, className = "", hideScrollbar = false, shadowGradient = true }: listProps) => {
    return (
        <div className={`relative w-[26em] h-[24em] rounded-lg ${className}`}>
            {/* Shadows (fixed in the outer container) */}
            {shadowGradient && (
                <>
                    <div className='absolute top-0 left-0 w-full h-8 pointer-events-none bg-gradient-to-b from-black/60 to-transparent z-10' />
                    <div className='absolute bottom-0 left-0 w-full h-8 pointer-events-none bg-gradient-to-t from-black/60 to-transparent z-10' />
                </>
            )}


            {/* Scrollable content with gap */}
            <div
                className="h-full overflow-scroll flex flex-col gap-4"
                style={{
                    scrollbarWidth: hideScrollbar ? 'none' : 'auto', // Firefox
                    msOverflowStyle: hideScrollbar ? 'none' : 'auto', // IE and Edge
                }}
            >
                {/* Hide scrollbar for Chrome, Safari, and Opera */}
                {hideScrollbar && (
                    <style>
                        {`
                            div::-webkit-scrollbar {
                                display: none;
                            }
                        `}
                    </style>
                )}
                {Children.map(children, (child, index) =>
                    isValidElement(child) ? cloneElement(child as ReactElement, { key: index }) : child
                )}
            </div>
        </div>
    )
}

interface ListItemProps {
    children?: ReactNode,
    className?: string,
    onClick?: () => void,
}

const ListItem = ({ children, className = "", onClick = () => { } }: ListItemProps) => {
    return (
        <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`bg-[#111111] hover:bg-neutral-800 cursor-pointer w-full min-h-12 rounded-lg flex items-center px-6 ${className}`}
        >
            {children}
        </motion.div>
    )
}

export { List, ListItem }
