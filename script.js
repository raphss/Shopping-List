function editarItem(btn) {
  var spanElement = btn.parentNode.firstChild;
  spanElement.contentEditable = true;
  spanElement.focus();

  var range = document.createRange();
  var sel = window.getSelection();
  range.setStart(spanElement, 1);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  spanElement.focus();

  spanElement.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      spanElement.blur();
      reorderList();
    }
  });

  spanElement.addEventListener('blur', function () {
    spanElement.contentEditable = false;
    reorderList();
  });
}

function excluirItem(btn) {
  var confirmacao = confirm('Tem certeza que deseja excluir este item?');
  if (confirmacao) {
    btn.parentNode.remove();
  }
}

function adicionarItem() {
  var novoItemInput = document.getElementById('novoItem');
  var novoItemText = novoItemInput.value.trim();

  if (novoItemText !== '') {
    var lista = document.getElementById('lista');
    var novoItem = document.createElement('li');

    novoItem.innerHTML =
      '<span class="editable" onclick="marcarComoComprado(this)">' +
      novoItemText +
      '</span> <button class="btn btn-edit" onclick="editarItem(this)">Editar</button><button class="btn btn-delete" onclick="excluirItem(this)">Excluir</button>';
    lista.appendChild(novoItem);
    novoItemInput.value = '';

    reorderList();
  }
}

function filtrarLista() {
  var input, filter, ul, li, span, txtValue;
  input = document.getElementById('barraPesquisa');
  filter = input.value.toUpperCase();
  ul = document.getElementById('lista');
  li = ul.getElementsByTagName('li');

  for (var i = 0; i < li.length; i++) {
    span = li[i].getElementsByTagName('span')[0];
    txtValue = span.textContent || span.innerText;

    if (txtValue.toUpperCase().indexOf(filter) > -1 || filter === '') {
      li[i].style.display = '';
    } else {
      li[i].style.display = 'none';
    }
  }
}

function marcarComoComprado(spanElement) {
  if (spanElement.isContentEditable) {
    return;
  }

  spanElement.classList.toggle('comprado');
  reorderList();
}

function reorderList() {
  var lista = document.getElementById('lista');
  var items = Array.from(lista.children).map(function (li) {
    var text = li.firstChild.textContent.trim().toLowerCase();
    var match = text.match(/\d+/);
    var number = match ? parseInt(match[0]) : 0;
    return {
      li: li,
      text: text,
      number: number,
      comprado: li.firstChild.classList.contains('comprado'),
    };
  });

  items.sort(function (a, b) {
    if (a.comprado === b.comprado) {
      return a.number - b.number;
    } else if (a.comprado && !b.comprado) {
      return 1;
    } else {
      return -1;
    }
  });

  items.forEach(function (item) {
    lista.appendChild(item.li);
  });
}
