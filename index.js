(function() {
    const embebed = {
        variables: {
            API_CHROMA: 'https://ubi.ceipa.edu.co/ubi/ask_question',
            API_PDF: 'https://ubi.ceipa.edu.co/ubi/generate_pdf',
        },
        externalLibs: {
            load: async () => {
                // Función para cargar un script y retornar una promesa
                const loadScript = (src) => {
                    return new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = src;
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                };

                // Cargar CSS de KaTeX
                const katexCss = document.createElement('link');
                katexCss.rel = 'stylesheet';
                katexCss.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
                document.head.appendChild(katexCss);

                try {
                    // Cargar KaTeX y Marked.js en paralelo, garantizando su disponibilidad
                    await Promise.all([
                        loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js'),
                        loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js')
                    ]);
                    console.log("Librerías externas cargadas con éxito.");
                } catch (error) {
                    console.error("Error al cargar las librerías externas:", error);
                }
            }
        },
        contents: {
            styles: `
                :root {
                    --maastricht_blue: #122338;
                    --silver-foil: #B0B1B1;
                    --white: #FFF;
                    --gray-100: #F3F4F6;
                    --black-2: rgba(0,0,0,.2);
                }

                #buttonFab, #containerChat { box-sizing: border-box; position: fixed; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
                
                #buttonFab { bottom: 1.25rem; right: 1.25rem; z-index: 1000; border: none; background: none; cursor: pointer; }
                .img-Room-fab { width: 4rem; height: 4rem; border-radius: 50%; box-shadow: 0 4px 10px var(--black-2); }

                #containerChat {
                    bottom: 1.25rem; right: 1.25rem; width: 0; height: 0; opacity: 0;
                    transform-origin: bottom right; transform: scale(0);
                    background: var(--white); border-radius: 1rem;
                    display: flex; flex-direction: column; overflow: hidden; z-index: 999;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                }

                #containerChat.showChat {
                    opacity: 1; transform: scale(1);
                    width: 90vw; height: 85vh; bottom: 7.5vh; right: 5vw;
                }

                #containerChat > header { 
                    background: var(--maastricht_blue); color: var(--white); padding: 1rem; 
                    display: flex; align-items: center; justify-content: space-between;
                }
                #containerChat > header h2 { margin: 0; font-size: 1.1rem; font-weight: 600; letter-spacing: 1px; }
                #buttonClose { background: none; border: none; cursor: pointer; opacity: 0.7; }
                #buttonClose:hover { opacity: 1; }

                #conversationChat { 
                    flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; 
                    gap: 1.2rem; background: var(--gray-100); scroll-behavior: smooth;
                }
                
                .itemChat { 
                    display: flex; gap: 0.8rem; max-width: 80%; padding: 0.8rem 1.2rem; 
                    border-radius: 1rem; font-size: 0.95rem; line-height: 1.5; position: relative;
                }
                .itemChat p { margin: 0 0 12px 0; }
                .itemChat p:last-child { margin-bottom: 0; }
                .itemChat h1, .itemChat h2, .itemChat h3 { margin: 15px 0 8px 0; font-size: 1.15em; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; }
                .itemChat ul, .itemChat ol { margin: 5px 0 12px 20px; padding: 0; }
                .itemChat li { margin-bottom: 6px; }
                
                .img-Room-chat { width: 2.2rem; height: 2.2rem; border-radius: 50%; flex-shrink: 0; }

                .incoming { align-self: flex-start; background: var(--maastricht_blue); color: var(--white); border-bottom-left-radius: 0; }
                .outgoing { align-self: flex-end; flex-direction: row-reverse; background: var(--silver-foil); color: var(--maastricht_blue); border-bottom-right-radius: 0; }
                .outgoing h1, .outgoing h2, .outgoing h3 { border-bottom: 1px solid rgba(18,35,56,0.1); }

                /* Formula Card Estilizada */
                .math-formula-card {
                    background: rgba(255,255,255,0.08);
                    border-left: 4px solid var(--white);
                    padding: 1.25rem; margin: 1rem 0; border-radius: 0.25rem;
                    overflow-x: auto; text-align: center;
                }
                .outgoing .math-formula-card { border-left: 4px solid var(--maastricht_blue); background: rgba(18,35,56,0.05); }
                
                .katex-display { margin: 0 !important; }
                .katex { font-size: 1.15em; }

                .chat-footer { padding: 1rem; background: var(--white); display: flex; gap: 0.5rem; border-top: 1px solid #ddd; }
                #inputChat { flex: 1; border: none; background: var(--gray-100); padding: 0.8rem; border-radius: 0.5rem; resize: none; font-family: inherit; outline: none; }
                #buttonSend { background: none; border: none; cursor: pointer; color: var(--maastricht_blue); }

                @media (max-width: 768px) {
                    #containerChat.showChat { width: 100vw; height: 100vh; bottom: 0; right: 0; border-radius: 0; }
                    .itemChat { max-width: 90%; }
                }

                .typing-dots span { display: inline-block; width: 5px; height: 5px; background: currentColor; border-radius: 50%; margin: 0 2px; animation: blink 1.4s infinite; }
                @keyframes blink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
            `,
            buttonFab: `<button id='buttonFab'><img src="${window.Ceipa.imageRoom}" class="img-Room-fab"/></button>`,
            chatRoom: `
                <div id="containerChat">
                    <header>
                        <h2>UBI - Your personal AI</h2>
                        <button id="buttonClose"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                    </header>
                    <ul id="conversationChat"></ul>
                    <div class="chat-footer">
                        <textarea id="inputChat" placeholder="Escribe tu duda académica aquí..." rows="1"></textarea>
                        <button id="buttonSend"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>
                    </div>
                </div>`
        },
        functions: {
            visibleChat: () => {
                const container = document.getElementById('containerChat');
                container.classList.toggle('showChat');
                if(container.classList.contains('showChat')) setTimeout(() => document.getElementById('inputChat').focus(), 500);
            },
            
            processMessageContent: (rawText) => {
                // 1. Limpieza de artefactos del LLM (ej: *\\no se suman** -> **no se suman**)
                let text = rawText.replace(/\*\\([^*]+)\*\*/g, '**$1**');
                
                // 2. Extraer y renderizar matemáticas DIRECTAMENTE antes de Marked
                let textWithMath = text.replace(/(\$\$[\s\S]*?\$\$|\$(?!\d|\s)[^$\n]+?(?<!\s)\$)/g, (match) => {
                    if (typeof katex === 'undefined') return match; // Fallback si KaTeX no cargó

                    const isDisplayMode = match.startsWith('$$');
                    const mathString = match.replace(/^\$\$?|\$\$?$/g, '').trim();
                    
                    try {
                        const renderedMath = katex.renderToString(mathString, {
                            displayMode: isDisplayMode,
                            throwOnError: false,
                            strict: false 
                        });

                        // Devolvemos HTML directamente, Marked lo ignorará por ser HTML crudo
                        return isDisplayMode 
                            ? `<div class="math-formula-card">${renderedMath}</div>` 
                            : renderedMath;
                    } catch (e) {
                        console.error("KaTeX error:", e);
                        return match; // Fallback si hay error de sintaxis grave
                    }
                });

                // 3. Convertir el texto restante a HTML con Marked
                if (typeof marked !== 'undefined') {
                    // Prevenir que Marked escape el HTML generado por KaTeX
                    return marked.parse(textWithMath, { mangle: false, headerIds: false });
                } else {
                    console.warn("Marked.js no cargó, devolviendo texto con saltos de línea.");
                    return textWithMath.replace(/\n/g, '<br>');
                }
            },

            addItem: (value, className, typeMessage) => {
                const conversationChat = document.getElementById('conversationChat');
                const li = document.createElement('li');
                li.className = `itemChat ${className} ${typeMessage}`;
                
                const icon = className === 'outgoing' 
                    ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
                    : `<img src="${window.Ceipa.imageRoom}" class="img-Room-chat"/>`;

                let finalHtml = value;

                if (value === 'Escribiendo...') {
                    finalHtml = `Escribiendo<span class="typing-dots"><span></span><span></span><span></span></span>`;
                } else if (className === 'incoming') {
                    finalHtml = embebed.functions.processMessageContent(value);
                } else if (className === 'outgoing') {
                    if (typeof marked !== 'undefined') {
                         finalHtml = marked.parse(value);
                    }
                }

                li.innerHTML = `${icon}<div>${finalHtml}</div>`;
                conversationChat.appendChild(li);
                conversationChat.scrollTop = conversationChat.scrollHeight;
            },
            
            sendChat: () => {
                const input = document.getElementById('inputChat');
                const text = input.value.trim();
                if(!text) return;
                embebed.functions.addItem(text, 'outgoing', 'bgOutgoing');
                input.value = '';
                embebed.functions.addItem('Escribiendo...', 'incoming', 'bgWriting');
                embebed.functions.requestApi(text);
            },
            requestApi: (query) => {
                fetch(embebed.variables.API_CHROMA, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(`${window.Ceipa.chatbotId}|${query}`)
                })
                .then(res => res.json())
                .then(data => {
                    const last = document.querySelector('.bgWriting');
                    if (last) last.remove();
                    embebed.functions.addItem(data.answer, 'incoming', 'bgIncoming-Success');
                })
                .catch(() => {
                    const last = document.querySelector('.bgWriting');
                    if (last) last.innerHTML = "Error de conexión.";
                });
            }
        }
    };

    // Usamos load en lugar del arreglo antiguo
    embebed.externalLibs.load();
    const styleEl = document.createElement('style');
    styleEl.textContent = embebed.contents.styles;
    document.head.appendChild(styleEl);

    const container = document.createElement('div');
    container.innerHTML = embebed.contents.buttonFab + embebed.contents.chatRoom;
    document.body.appendChild(container);

    document.getElementById('buttonFab').onclick = embebed.functions.visibleChat;
    document.getElementById('buttonClose').onclick = embebed.functions.visibleChat;
    document.getElementById('buttonSend').onclick = embebed.functions.sendChat;
    document.getElementById('inputChat').onkeydown = (e) => { if(e.keyCode == 13 && !e.shiftKey) { e.preventDefault(); embebed.functions.sendChat(); } };

    setTimeout(() => {
        embebed.functions.addItem('¡Hola! Soy UBI, tu asistente con IA. ¿En qué puedo apoyarte hoy?', 'incoming', 'bgIncoming-Success');
    }, 1500);
})();