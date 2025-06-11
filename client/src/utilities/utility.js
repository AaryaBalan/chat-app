import React from "react";

// format the user message
export const formatMessage = (text) => {
    if (!text) return null;
    const linkRegex = /((https?:\/\/|www\.)[^\s]+|(?:[a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?)/gi;

    const parts = text.split('\n');
    return parts.map((part, index) => (
        <React.Fragment key={index}>
            {
                part.split(linkRegex).map((chunk, i) => {
                    if (chunk?.match(linkRegex)) {
                        const hasHttp = chunk.startsWith('http://') || chunk.startsWith('https://');
                        const url = hasHttp ? chunk : `https://${chunk}`;
                        return (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="underline text-[#4fa0ff] hover:text-[hsl(212,100%,50%)]">
                                {chunk}
                            </a>
                        );
                    }
                    return chunk;
                })
            }
            <br />
        </React.Fragment>
    ));
};

// toast options
export const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "Dark",
};