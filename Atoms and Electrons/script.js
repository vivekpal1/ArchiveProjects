(function() {
  new Vue({
    el: '#App',
    data: {
      electrons: 0,
      electronsSlide: 1,
      diagram: [],
      sequence: {},
      notation: [],
      showFullNotation: false,
      layers: [],
      search: 'H',
      elements: ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'],
      infoDialog: false,
      help: ['You can select any element through the slider by its atomic number, or by clicking on the nucleus and typing its initials.', 'written below the slider there is the simple notation of the distribution of the electrons, clicking on it expands the complete notation.', 'the magnifying glass button does a google search for more information of the selected element, if you have any input error it will be disabled.']
    },
    methods: {
      buildDiagram: function() {
        var i, j, length, results;
        results = [];
        for (i = j = 0; j <= 6; i = ++j) {
          length = -Math.abs(i - 3.5) + 4.5;
          results.push(this.diagram.push(Array(length).fill(0)));
        }
        return results;
      },
      generateSequence: function() {
        var a, b, j, l, posX, posY, x;
        [posX, posY] = [[], []];
        for (x = j = 0; j <= 30; x = ++j) {
          a = 3 - x % 4;
          b = x - 3 * Math.round(x / 4);
          l = x / 6.7;
          if (a <= l) {
            posX.push(a);
          }
          if (b >= l) {
            posY.push(b);
          }
        }
        return this.sequence = {posX, posY};
      },
      distributeElectrons: function() {
        var _, count, i, j, len, posX, posY, ref, results, x, y;
        count = this.electrons >= 0 ? this.electrons : 0;
        ref = this.sequence.posX;
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          _ = ref[i];
          ({posX, posY} = this.sequence);
          [x, y] = [posX[i], posY[i]];
          results.push(count -= this.diagram[y][x] = count < 2 + 4 * x ? count : 2 + 4 * x);
        }
        return results;
      },
      writeNotation: function() {
        var _, i, j, len, posX, posY, ref, sublayers, x, y;
        sublayers = ['s', 'p', 'd', 'f'];
        this.notation.length = 0;
        ref = this.sequence.posX;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          _ = ref[i];
          ({posX, posY} = this.sequence);
          [x, y] = [posX[i], posY[i]];
          if (this.diagram[y][x]) {
            this.notation.push({
              location: (y + 1) + sublayers[x],
              electrons: this.diagram[y][x]
            });
          }
        }
        if (this.notation.length > 5) {
          return this.notation.splice(2, 0, '...');
        }
      },
      getLayersElectrons: function() {
        var j, layer, len, ref, results;
        this.layers.length = 0;
        ref = this.diagram;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          layer = ref[j];
          results.push(this.layers.push(layer.reduce((a, b) => {
            return a + b;
          })));
        }
        return results;
      },
      increment: function(value) {
        if (this.electrons > 1 && value < 0 || this.electrons < 118 && value > 0) {
          return this.electrons += value;
        }
      },
      updateElectrons: function() {
        return this.electrons = this.electronsSlide;
      },
      updateElementName: function() {
        return this.search = this.elements[this.electrons];
      },
      reversedArr: function(arr) {
        var i, j, ref, results;
        results = [];
        for (i = j = ref = arr.length - 1; j >= 0; i = j += -1) {
          results.push(arr[i]);
        }
        return results;
      },
      googleSearchElement: function() {
        var name;
        name = this.elements[this.electrons];
        return window.open(`https://www.google.com.br/search?q=element+${name}+${this.electrons}+periodic+table`);
      }
    },
    watch: {
      electrons: function() {
        this.distributeElectrons();
        this.writeNotation();
        this.getLayersElectrons();
        if (this.electrons > 0) {
          return this.electronsSlide = this.electrons;
        }
      },
      search: function() {
        return this.electrons = this.elements.indexOf(this.search);
      }
    },
    filters: {
      electronsIndicator: function(val) {
        if (val > 0) {
          return val;
        } else {
          return '?';
        }
      }
    },
    beforeMount: function() {
      this.buildDiagram();
      return this.generateSequence();
    },
    mounted: function() {
      return this.electrons = 1;
    }
  });

}).call(this);
