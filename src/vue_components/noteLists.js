var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var Isotope = require("isotope-layout");
require("isotope-fit-columns");
require("isotope-packery");

var moment2 = require("moment");

Vue.component('note-list', {
    mounted: function() {
        var dis = this;

        this.$nextTick(function() {
            var grid = document.querySelector('.grid');

            var iso = new Isotope('.grid', {
                itemSelector: '.grid-item',
                layoutMode: 'packery',
                packery: {
                    gutter: 5,
                },
                percentPosition: true
            });

            console.log("Binding Masonry", dis, dis.$el, grid, iso);
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
            order: "",
            hideChecked: this.hideChecked || false,
            noteList: this.noteList || []
        }
    },
    computed: {
        r_noteList: function() {
            return this.noteList.slice(0).reverse();
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
            this.$emit('editNote', note);
        },
        deleteNote: function(note) {
            this.$emit('deleteNote', note);
        },
        moment: moment2
    },
    template: `
        <div v-if="noteList !== null" class="container grid">
            <note-card v-bind:class="'grid-item'" v-for="(note, i) in r_noteList"
            v-bind:index="i" v-bind:key="note.uuid" v-bind:noteData="note" 
            v-bind:colors="colors"
            v-on:editNote="editNote" v-on:todoToggle="todoToggle" v-on:colorChange="colorChange"
            v-on:deleteNote="deleteNote"></note-card>
        </div>
    `
});