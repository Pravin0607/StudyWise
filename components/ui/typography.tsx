import { cn } from "@/lib/utils";
import React from "react";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
}

// Heading Components
export function H1({ children, className, ...props }: TypographyProps) {
    return (
        <h1
            className={cn(
                "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
                className
            )}
            {...props}
        >
            {children}
        </h1>
    );
}

export function H2({ children, className, ...props }: TypographyProps) {
    return (
        <h2
            className={cn(
                "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
                className
            )}
            {...props}
        >
            {children}
        </h2>
    );
}

export function H3({ children, className, ...props }: TypographyProps) {
    return (
        <h3
            className={cn(
                "scroll-m-20 text-2xl font-semibold tracking-tight",
                className
            )}
            {...props}
        >
            {children}
        </h3>
    );
}

export function H4({ children, className, ...props }: TypographyProps) {
    return (
        <h4
            className={cn(
                "scroll-m-20 text-xl font-semibold tracking-tight",
                className
            )}
            {...props}
        >
            {children}
        </h4>
    );
}

// Paragraph Components
export function Large({ children, className, ...props }: TypographyProps) {
    return (
        <p
            className={cn("text-lg font-semibold sm:text-xl md:text-2xl", className)}
            {...props}
        >
            {children}
        </p>
    );
}

export function Default({ children, className, ...props }: TypographyProps) {
    return (
        <p
            className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
            {...props}
        >
            {children}
        </p>
    );
}

export function Small({ children, className, ...props }: TypographyProps) {
    return (
        <small
            className={cn("text-sm font-medium leading-none", className)}
            {...props}
        >
            {children}
        </small>
    );
}

// Special Text Components
export function Subtle({ children, className, ...props }: TypographyProps) {
    return (
        <p className={cn("text-sm text-muted-foreground", className)} {...props}>
            {children}
        </p>
    );
}

export function Lead({ children, className, ...props }: TypographyProps) {
    return (
        <p className={cn("text-xl text-muted-foreground", className)} {...props}>
            {children}
        </p>
    );
}

export function Blockquote({ children, className, ...props }: TypographyProps) {
    return (
        <blockquote
            className={cn("mt-6 border-l-2 pl-6 italic", className)}
            {...props}
        >
            {children}
        </blockquote>
    );
}

// List Components
export function List({ children, className, ...props }: TypographyProps) {
    return (
        <ul
            className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
            {...props}
        >
            {children}
        </ul>
    );
}

export function InlineCode({ children, className, ...props }: TypographyProps) {
    return (
        <code
            className={cn(
                "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
                className
            )}
            {...props}
        >
            {children}
        </code>
    );
}