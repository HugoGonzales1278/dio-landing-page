 /* ══════════════════════════════════════════
       REFERÊNCIAS
    ══════════════════════════════════════════ */
    const body        = document.body;
    const audio       = document.getElementById('music');
    const audioSrc    = document.getElementById('music-source');
    const switchBtn   = document.getElementById('switch-theme-button');
    const kidsImg     = document.getElementById('kids-img');
    const monsterImg  = document.getElementById('monster-img');
    const slotTop     = document.getElementById('slot-top');
    const slotBottom  = document.getElementById('slot-bottom');
    const indicator   = document.getElementById('world-indicator');
    const form        = document.getElementById('subscriptionForm');
    const formMsg     = document.getElementById('formMsg');
    const cursorRing  = document.getElementById('cursorRing');

    /* ══════════════════════════════════════════
       CAMINHOS DOS ÁUDIOS — ajuste se necessário
    ══════════════════════════════════════════ */
    const AUDIO = {
      normal:   '../src/assets_musics_normal-world.mpeg',
      inverted: '../src/assets_musics_inverted-world.mpeg'
    };

    /* ══════════════════════════════════════════
       CURSOR PERSONALIZADO
    ══════════════════════════════════════════ */
    document.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
      cursorRing.style.left = x + 'px';
      cursorRing.style.top  = y + 'px';
    });

    /* ══════════════════════════════════════════
       INVERSÃO DOS MUNDOS
       - Troca as classes de tema no <body>
       - Inverte a ordem dos slots (order CSS)
       - Aplica/remove classe .invertido nas imgs
       - Troca o áudio
    ══════════════════════════════════════════ */
    let isInverted = false;

    function switchTheme() {
      isInverted = !isInverted;

      /* Tema visual */
      body.classList.toggle('dark-theme',  isInverted);
      body.classList.toggle('light-theme', !isInverted);
      body.setAttribute('aria-label',
        isInverted
          ? 'O site está usando o tema Mundo Invertido'
          : 'O site está usando o tema claro'
      );

      /* Personagens:
         Normal   → kids (top, normal) | monstro (bottom, scaleY-1)
         Invertido → monstro (top, scaleY+1) | kids (bottom, scaleY-1) */
      slotTop.style.order    = isInverted ? '1' : '0';
      slotBottom.style.order = isInverted ? '0' : '1';
      kidsImg.classList.toggle('invertido',    isInverted);
      monsterImg.classList.toggle('invertido', isInverted);

      /* Indicador */
      indicator.textContent = isInverted
        ? '// mundo invertido — território de Vecna'
        : '// mundo normal — Hawkins, Indiana';

      /* Texto do botão */
      switchBtn.textContent = isInverted ? 'Voltar ao Mundo Normal' : 'Inverter Mundos';

      /* Áudio */
      audioSrc.src = isInverted ? AUDIO.inverted : AUDIO.normal;
      audio.load();
      audio.play().catch(() => {
        /* Autoplay bloqueado — o navegador requer interação prévia */
      });
    }

    switchBtn.addEventListener('click', switchTheme);

    /* ══════════════════════════════════════════
       FORMULÁRIO — validação e feedback
    ══════════════════════════════════════════ */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Reset da mensagem */
      formMsg.className  = 'form-msg';
      formMsg.textContent = '';

      const nome       = document.getElementById('txtName').value.trim();
      const email      = document.getElementById('txtEmail').value.trim();
      const level      = Number(document.getElementById('txtLevel').value);
      const personagem = document.getElementById('txtCharacter').value.trim();

      /* Validações */
      if (nome.length < 3) {
        return msg('❌ O nome deve ter pelo menos 3 caracteres.', 'error');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return msg('❌ Digite um e-mail válido.', 'error');
      }
      if (level < 1 || level > 20 || isNaN(level)) {
        return msg('❌ O level deve ser entre 1 e 20.', 'error');
      }
      if (personagem.length < 10) {
        return msg('❌ Descreva melhor seu personagem (mínimo 10 caracteres).', 'error');
      }

      console.log('Inscrição:', { nome, email, level, personagem });
      msg(`🎉 Inscrição realizada com sucesso, ${nome}! Bem-vindo ao Clube de D&D 🎲`, 'success');
      form.reset();
    });

    function msg(texto, tipo) {
      formMsg.textContent = texto;
      formMsg.classList.add(tipo);
    }