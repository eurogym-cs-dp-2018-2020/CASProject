schoolMap = {
  floor: {
    select(e = '', exact) {
      schoolMap.floor.deSelect();

      if (e == '' || exact)
        theFloor = document.getElementById(exact)
      else
        theFloor = e.target.farthestViewportElement ? e.target.farthestViewportElement : e.target

      switch (theFloor.id) {
        case '4':
          marginBefore = '0'
          marginAfter = '415px'
          break;
        case '3':
          marginBefore = '270px'
          marginAfter = '580px'
          break;
        case '2':
          marginBefore = '410px'
          marginAfter = '560px'
          break;
        case '1':
          marginBefore = '490px'
          marginAfter = '0'
          break;
      }

      theFloor.style.transform = 'none';
      theFloor.style.top = marginBefore;

      theEl = theFloor.nextElementSibling;

      while (theEl) {
        theEl.style.top = marginAfter;
        theEl = theEl.nextElementSibling;
      }

      theFloor.classList.add('selected')

    },
    deSelect() {
      for (el of document.getElementsByClassName('svgFloor')) {
        el.style.transform = '';
        el.style.top = '';
        el.classList.remove('selected')
      }
    }
  },
  display: {
    open(e) {
      console.log('opening display');

      const id = e.target.id;
      const theLevel = e.target.farthestViewportElement.id;

      const str = rooms.levels[theLevel][id];
      if (!str)
        return;

      const oldName = (typeof str.name !== 'undefined') ? str.name : '';
      const rdbleName = e.target.parentNode.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML;

      roomDisplay = document.getElementById('roomDisplay');
      roomDisplay.innerHTML = '';

      if (id)
        roomDisplay.innerHTML += `<h2 style="border: none; border-bottom: 2px solid ${typeof str.ladder !== 'undefined' ? str.ladder + '; padding-bottom: .4em' : ''}">${oldName} <sup>${rdbleName}</sup></h2>`;
      if (str.board) {
        roomDisplay.innerHTML +=
          '<p>Whiteboard: ' +
          ((str.board === 'smart') ?
            'Interactive</p>' :
            'Simple</p>');
      }
      if (str.projector)
        roomDisplay.innerHTML += `<p>Has a projector</p>`;
      if (str.appletv)
        roomDisplay.innerHTML += `<p>Apple TV: name</p>`;
      if (str.seats)
        roomDisplay.innerHTML += `<p>${str.seats} places</p>`;
      if (str.additionaly)
        roomDisplay.innerHTML += `<p>Additional info: ${str.additionaly}</p>`;

      roomDisplay.classList.add('opened');
    },
    close() {
      document.getElementById('roomDisplay').classList.remove('opened');
    }
  },
  load: level => {
    if (typeof document.getElementsByTagName('svg')[0] !== 'undefined' && level === document.getElementsByTagName('svg')[0].id)
      return // prevent multiloads

    if (((localStorage.level != level || (localStorage.level === level || document.getElementsByTagName('svg').length === 0 && level != document.getElementsByTagName('svg')[0].id)) || document.getElementsByClassName('svgFloor').length == 0) && level <= settings.maxLevel) {
      localStorage.level = level

      addScript(`levels/${level}.svg`, function(theSvg) {
        if (typeof document.getElementsByTagName('svg')[0] !== 'undefined') {
          timeoutAnimation = 450
          for (el of document.getElementsByClassName('svgFloor')) {
            settings.temp.oldLevel = el.id
            setTimeout(() => {
              el.parentNode.removeChild(el)
            }, timeoutAnimation);
          }
        } else {
          timeoutAnimation = 0
        }

        setTimeout(() => {
          document.body.appendChild(theSvg)

          document.getElementsByTagName('svg')[0].id = level

          classes = document.getElementsByTagName('svg').item(0).getElementById('classes');
          rects = classes.getElementsByTagName('g');
          for (el of rects) {
            console.log(el);
            el.children.item(0).setAttribute('fill', 'rgba(25, 25, 25)');
            el.children.item(0).setAttribute('opacity', 0.5);

            if (!el.id.includes('WC') && !el.id.includes('room')) {
              el.setAttribute('onclick', '');
              el.onclick = schoolMap.display.open;
            }

            el.addEventListener('mouseenter', e => {
              if (typeof e.target.getElementsByTagName('text')[0] === 'undefined')
                return

              e.target.children.item(0).setAttribute('opacity', 0.1);
              e.target.children.item(0).setAttribute('fill', 'white');

              if (typeof document.getElementById('display').getElementsByTagName('h1')[0] === 'undefined')
                return

              if (document.getElementById('display').getElementsByTagName('h1')[0].innerHTML === e.target.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML)
                document.getElementById('display').classList.add('hover');

            })

            el.addEventListener('mouseleave', e => {
              if (typeof e.target.getElementsByTagName('text')[0] === 'undefined')
                return

              e.target.children.item(0).setAttribute('opacity', 0.5);
              e.target.children.item(0).setAttribute('fill', 'rgba(25, 25, 25)');

              if (typeof document.getElementById('display').getElementsByTagName('h1')[0] === 'undefined')
                return

              if (document.getElementById('display').getElementsByTagName('h1')[0].innerHTML === e.target.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML)
                document.getElementById('display').classList.remove('hover');
            })
          }
        }, timeoutAnimation);

      })

      for (elem of document.getElementsByTagName('nav')[0].children) {
        elem.classList.remove('selected');

        if (elem.innerHTML === localStorage.level)
          elem.classList.add('selected');
      }
    }
  },
  loadAll: function() {
    for (let level = 4; level >= 1; level--) {
      addScript(`levels/${level}.svg`, theSvg => {
        document.body.appendChild(theSvg)

        theLevelTitle = document.createElement('p');
        theLevelTitle.className = 'levelTitle'
        theLevelTitle.innerText = level;
        document.body.appendChild(theLevelTitle)

        theSvg.style.opacity = '0'
        theSvg.style.transform = 'scale(.1)'
        theSvg.style.transitionDuration = '1s'
        theSvg.classList.add('initial')
        setTimeout(() => {
          theSvg.style.opacity = '1'
          theSvg.style.transform = 'scale(1)'
          theSvg.style.transitionDuration = '1s'
        }, 200);
        setTimeout(() => {
          theSvg.style.transform = 'perspective(100em) rotateX(70deg) rotateZ(-30deg)';
        }, 800);
        setTimeout(() => {
          theSvg.classList.remove('initial')
          theSvg.style.transform = ''
          theSvg.style.transitionDuration = ''
          theSvg.style.opacity = ''
        }, 1350);

        document.getElementsByTagName('svg')[4 - level].id = level

        theSvg.onclick = schoolMap.floor.select

        theSvg.onmouseenter = function() {
          display = document.getElementById('display');

          for (el of display.children) {
            el.innerHTML = ''
          };

          display.className = 'opened'

          for (key in rooms.levels[level]) {
            theP = document.createElement('p');
            theP.innerHTML = key;
            display.children.item(0).appendChild(theP);

            name = rooms.levels[level][key].name

            theName = document.createElement('p')
            theName.innerHTML = name == 'undefined' ? '<br>' : name;

            display.children.item(1).appendChild(theName)
          }
        }

        theSvg.onmouseleave = function() {
          document.getElementById('display').className = ''
        }

        classes = document.getElementsByTagName('svg').item(4 - level).getElementById('classes');
        rects = classes.getElementsByTagName('g');
        for (el of rects) {
          el.children.item(0).setAttribute('fill', 'rgba(25, 25, 25)');
          el.children.item(0).setAttribute('opacity', 0.5);

          if (!el.id.includes('WC') && !el.id.includes('room')) {
            el.setAttribute('onclick', '');
          }

          el.onclick = schoolMap.display.open;
        }
      })
    }
  }
}

function addScript(src, onload = '') {
  xhr = new XMLHttpRequest();
  xhr.open('GET', src, false);
  xhr.overrideMimeType('image/svg+xml'); // not needed if your server delivers SVG with correct MIME type (just to be on the safe side)
  xhr.send('');
  if (xhr.responseXML)
    onload(xhr.responseXML.documentElement);
  else {
    text = 'Error loading ' + src
    console.log(text);
    alert(text);
  }
}

function loadJSON(filename, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', filename, true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

document.onkeydown = e => {
  if (e.code === 'Escape') {
    if (document.getElementById('roomDisplay').classList.contains('opened'))
      schoolMap.display.close()
    else
      schoolMap.floor.deSelect()
  }

  if (e.code.includes('Digit'))
    schoolMap.floor.select('', e.code.split('Digit')[1])

  if (e.code.includes('Arrow')) {
    currentId = document.getElementsByClassName('selected').length == 0 ? 0 : document.getElementsByClassName('selected')[0].id

    way = e.code.split('Arrow')[1]

    if (way == 'Down') {
      if (currentId === 0)
        currentId = 5
      schoolMap.floor.select('', currentId - 1)
    } else if (way == 'Up')
      schoolMap.floor.select('', Number(currentId) + 1)
  }
}

document.onclick = e => {
  parents = []
  element = e.target
  while (element.parentElement) {
    parents.push(element)
    element = element.parentElement
  }
  mouseIsNotOnSvg = parents.every(el => el.tagName !== 'svg')

  if (mouseIsNotOnSvg)
    schoolMap.floor.deSelect()
}

document.addEventListener('DOMContentLoaded', function() {
  schoolMap.loadAll();
})

loadJSON('structure.json', e => {
  window.rooms = JSON.parse(e)
})