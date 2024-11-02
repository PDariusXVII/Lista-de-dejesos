// Função para calcular o total
function calculateTotal() {
  const priceElements = document.querySelectorAll('.price'); // Seleciona todos os elementos com a classe "price"
  let total = 0; // Inicializa a variável total

  priceElements.forEach(priceElement => {
      // Extrai o valor numérico da string, removendo "R$" e substituindo a vírgula por ponto
      const priceValue = parseFloat(priceElement.textContent.replace('R$', '').replace('.', '').replace(',', '.'));
      
      // Seleciona o elemento de quantidade correspondente
      const quantidadeElement = priceElement.closest('.item').querySelector('.quantidade'); // Ajustado para buscar dentro de .item
      const quantidadeValue = parseInt(quantidadeElement.textContent) || 0; // Converte a quantidade para número, ou 0 se não for válido

      // Verifica se o valor extraído é um número válido
      if (!isNaN(priceValue) && quantidadeValue > 0) {
          total += priceValue * quantidadeValue; // Multiplica a quantidade pelo preço e soma ao total
      }
  });

  // Atualiza o elemento que exibe o total
  const totalValueElement = document.getElementById('totalValue');
  if (totalValueElement) {
      totalValueElement.textContent = 'Total: R$ ' + formatCurrency(total);
  } else {
      console.error('Elemento para exibir o total não encontrado.');
  }
}

// Função para formatar um número como moeda brasileira
function formatCurrency(value) {
  // Converte o número para string e formata com pontos e vírgula
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Chama a função para calcular o total quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', calculateTotal);




// MENU-BTN //
const navElement = document.querySelector("nav");
const activeElement = document.createElement("div");
activeElement.classList.add("active-element");

// Função para calcular a posição do elemento ativo
const getOffsetLeft = (element) => {
  const elementRect = element.getBoundingClientRect();
  return (
    elementRect.left - navElement.getBoundingClientRect().left +
    (elementRect.width - activeElement.offsetWidth) / 2
  );
};

// Adiciona o elemento ativo ao menu de navegação
navElement.appendChild(activeElement);
const activeButton = navElement.querySelector("ul li.active button");

// Verifica se as fontes e o elemento foram carregados corretamente
document.fonts.ready.then(() => {
  gsap.set(activeElement, {
    x: getOffsetLeft(activeButton),
  });
  gsap.to(activeElement, {
    "--active-element-show": "1",
    duration: 0.2,
  });
});

// Adiciona os eventos de clique aos botões do menu
navElement.querySelectorAll("ul li button").forEach((button, index) => {
  button.addEventListener("click", () => {
    const active = navElement.querySelector("ul li.active");
    const oldIndex = [...active.parentElement.children].indexOf(active);

    if (
      index === oldIndex ||
      navElement.classList.contains("before") ||
      navElement.classList.contains("after")
    ) {
      return; // Se o botão ativo for clicado novamente, não faz nada
    }

    const x = getOffsetLeft(button);
    const direction = index > oldIndex ? "after" : "before";
    const spacing = Math.abs(x - getOffsetLeft(active));

    navElement.classList.add(direction);
    active.classList.remove("active");
    button.parentElement.classList.add("active");

    gsap.set(activeElement, {
      rotateY: direction === "before" ? "180deg" : "0deg",
    });

    gsap.to(activeElement, {
      keyframes: [
        {
          "--active-element-width": `${
            spacing > navElement.offsetWidth - 60
              ? navElement.offsetWidth - 60
              : spacing
          }px`,
          duration: 0.3,
          ease: "none",
          onStart: () => {
            createSVG(activeElement);
            gsap.to(activeElement, {
              "--active-element-opacity": 1,
              duration: 0.1,
            });
          },
        },
        {
          "--active-element-scale-x": "0",
          "--active-element-scale-y": ".25",
          "--active-element-width": "0px",
          duration: 0.3,
          onStart: () => {
            gsap.to(activeElement, {
              "--active-element-mask-position": "40%",
              duration: 0.5,
            });
            gsap.to(activeElement, {
              "--active-element-opacity": 0,
              delay: 0.45,
              duration: 0.25,
            });
          },
          onComplete: () => {
            // Aguarde um pouco antes de redefinir o estilo
            setTimeout(() => {
              activeElement.innerHTML = "";
              navElement.classList.remove("before", "after");
              activeElement.removeAttribute("style");
              gsap.set(activeElement, {
                x: getOffsetLeft(button),
                "--active-element-show": "1",
              });
            }, 50);
          },
        },
      ],
    });

    gsap.to(activeElement, {
      x,
      "--active-element-strike-x": "-50%",
      duration: 0.6,
      ease: "none",
    });
  });
});

// Função para criar o SVG do elemento ativo
const createSVG = (element) => {
  element.innerHTML = `
    <svg viewBox="0 0 116 5" preserveAspectRatio="none" class="beam">
      <path d="M0.5 2.5L113 0.534929C114.099 0.515738 115 1.40113 115 2.5C115 3.59887 114.099 4.48426 113 4.46507L0.5 2.5Z" fill="url(#gradient-beam)"/>
      <defs>
        <linearGradient id="gradient-beam" x1="2" y1="2.5" x2="115" y2="2.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="#6AAAFF"/>
          <stop offset="1" stop-color="white"/>
        </linearGradient>
      </defs>
    </svg>
    <div class="strike">
      <svg viewBox="0 0 114 12" preserveAspectRatio="none">
        <g fill="none" stroke="white" stroke-width="0.75" stroke-linecap="round">
          <path d="..." />
          <path d="..." />
        </g>
      </svg>
    </div>`;
};

// FIM DO CÓDIGO DO MENU





// Função de pesquisa com integração do filtro
function searchAndFilterItems() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const selectedCategory = document.querySelector('.category-filter .active')?.dataset.category || 'tudo';
  
  const items = document.querySelectorAll('.item');
  items.forEach(item => {
      const title = item.querySelector('h3').textContent.toLowerCase();
      const matchesQuery = title.includes(query);
      const matchesCategory = selectedCategory === 'tudo' || item.classList.contains(selectedCategory);

      // Exibir item apenas se corresponder à busca e à categoria selecionada
      item.style.display = matchesQuery && matchesCategory ? 'block' : 'none';
  });
}

// Evento para o campo de pesquisa
document.getElementById('search-input').addEventListener('input', searchAndFilterItems);




// CATEGORIA//
function filterItems(category) {
  // Seleciona todos os itens
  const items = document.querySelectorAll('.item');
  items.forEach(item => {
      // Se a categoria for 'tudo', mostra todos os itens
      if (category === 'tudo') {
          item.style.display = 'block';
      } else {
          // Caso contrário, mostra apenas os itens da categoria escolhida
          if (item.classList.contains(category)) {
              item.style.display = 'block';
          } else {
              item.style.display = 'none';
          }
      }
  });
}




// Função para alternar visibilidade do dropdown no mobile
function toggleDropdown() {
  const dropdownList = document.getElementById("dropdownList");
  dropdownList.style.display = dropdownList.style.display === "block" ? "none" : "block";
}




