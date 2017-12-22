var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var Isotope = require("isotope-layout");
require("isotope-fit-columns");
require("isotope-packery");

Vue.component('note-list', {
    mounted: function() {
        var grid = document.querySelector('.grid');

        this.iso = new Isotope('.grid', {
            itemSelector: '.grid-item',
            layoutMode: 'packery',
            packery: {
                gutter: 0,
            },
            stagger: 50,
            transitionDuration: 150,
            percentPosition: true,
            getSortData: {
                index: '[index]'
            },
            sortBy: 'index',
            sortAscending: true,
            initLayout: false
        });

        console.log("Binding Masonry", this.$el, grid, this.iso);

        var dis = this;

        this.$nextTick(function() {
            dis.iso.layout();

            dis.iso.reloadItems();
            dis.iso.arrange({});
        });
    },
    props: {
        hideChecked: {
            type: Boolean,
            default: false
        },
        searchFor: {
            type: String,
            default: ''
        },
        noteList: {
            type: Array,
            default: function() {
                return [];
            }
        },
        colors: Array
    },
    data: function() {
        return {
            hideChecked: this.hideChecked || false,
            noteList: this.noteList || []
        }
    },
    computed: {
        r_noteList: function() {
            return this.noteList.slice(0).reverse();
        },
        p_noteList: function() {
            var dis = this;

            this.$nextTick(function() {
                dis.iso.layout();

                dis.iso.reloadItems();
                dis.iso.arrange({});
            });

            return this.r_noteList;
        }
    },
    methods: {
        todoToggle: function(note, to) {
            this.$emit('todoToggle', note, to);
        },
        colorChange: function(note, to) {
            this.$emit('colorChange', note, to);
        },
        editNote: function(note) {
            this.iso.reloadItems();
            this.iso.arrange({});

            this.$emit('editNote', note);
        },
        deleteNote: function(note) {
            this.iso.reloadItems();
            this.iso.arrange({});

            this.$emit('deleteNote', note);
        }
    },
    template: `
        <div v-if="noteList !== null" class="grid">
            <note-card v-bind:class="'grid-item'" v-for="(note, i) in p_noteList"
            v-bind:index="i" v-bind:key="note.uuid" v-bind:noteData="note" 
            v-bind:colors="colors"
            v-on:editNote="editNote" v-on:todoToggle="todoToggle" v-on:colorChange="colorChange"
            v-on:deleteNote="deleteNote"></note-card>
        </div>
    `
});