var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

Packery = require("packery");
Draggabilly = require("draggabilly");

var makeDraggie = function(iso) {

    /*
    UNBIND NEEDS TO BE DONE AS WELL!!
    OR JUST BIND TO THE NEW ELEMENTS..
    */

    console.log(iso);
    iso.getItemElements().forEach(function(gridItem, i) {
        var draggie = new Draggabilly(gridItem);

        iso.bindDraggabillyEvents(draggie);
    });
};

Vue.component('note-list', {
    mounted: function() {
        var grid = document.querySelector('.grid');

        this.iso = new Packery('.grid', {
            itemSelector: '.grid-item',
            gutter: 0,
            stagger: 50,
            transitionDuration: 150,
            percentPosition: true,
            getSortData: {
                index: '[index]'
            },
            sortBy: 'index',
            sortAscending: true
        });

        this.iso.on('dragItemPositioned', this.orderNotes);

        console.log("Binding Masonry", this.$el, grid, this.iso);

        var dis = this;

        this.$nextTick(function() {
            dis.iso.reloadItems();
            dis.iso.layout();
            makeDraggie(dis.iso);
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
                dis.iso.reloadItems();
                dis.iso.layout();
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
            makeDraggie(this.iso);

            this.$emit('editNote', note);
        },
        orderNotes: function(e) {
            this.$emit('orderNotes', e);
        },
        deleteNote: function(note) {
            this.iso.reloadItems();
            makeDraggie(this.iso);

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