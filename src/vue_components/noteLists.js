var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

Vue.component('note-list', {
    props: {
        noteList: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data: function() {
        return {
            noteList: this.noteList || []
        }
    },
    computed: {
        r_noteList: function() {
            return this.noteList.slice(0).reverse();
        }
    },
    methods: {},
    template: `
        <div v-if="noteList !== null" class="container">
            <div class="columns" v-for="(note, i) in this.r_noteList">
                <note-card class="col-12 light" v-bind:index="i" v-bind:key="note.uuid" v-bind:noteData="note"></note-card>
            </div>
        </div>
    `
});