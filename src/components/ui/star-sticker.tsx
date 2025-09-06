import { cn } from "@/lib/utils";

export const StarSticker = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("absolute w-16 h-16 fill-yellow-300 stroke-accent stroke-2", className)}
        style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))' }}
    >
        <path d="M50,5 L61.8,38.2 L98.2,38.2 L68.2,59.5 L79.5,92.5 L50,71.5 L20.5,92.5 L31.8,59.5 L1.8,38.2 L38.2,38.2 Z" />
    </svg>
);
