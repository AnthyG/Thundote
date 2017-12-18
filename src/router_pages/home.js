var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var Home = {
    beforeMount: function() {
        this.getNoteList();
        console.log("Loaded home");
        console.log(this.noteList, this.noteList !== null);
    },
    props: {
        getNoteList: Function,
        noteList: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    methods: {
        goto: function(to) {
            Router.navigate(to);
        },
        addNote: function() {
            this.$emit('addNote');
        }
    },
    template: `
        <div>
            <div class="empty">
                <div class="empty-icon">
                    <i class="icon icon-people"></i>
                </div>
                <p class="empty-title h5">{{ this.noteList.length }} notes</p>
                <p class="empty-subtitle">Click the button to add a new note.</p>
                <div class="empty-action">
                    <button class="btn btn-primary" v-on:click.prevent="addNote">Add note</button>
                </div>
            </div>
            <note-list v-if="this.noteList !== null" v-bind:noteList="this.noteList"></note-list>
        </div>
    `
};

module.exports = Home;