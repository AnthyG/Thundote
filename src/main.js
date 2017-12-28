var ZeroFrame = require("./ZeroFrame.js");

var Vue = require("vue/dist/vue.min.js");

var Router = require("./router.js");

var VueZeroFrameRouter = require("./vue-zeroframe-router.js");

require("./vue_components/avatar.js");
require("./vue_components/navbar.js");
require("./vue_components/note.js");
require("./vue_components/noteLists.js");

autosize = require("autosize");
marked = require("marked");
moment = require("moment");
pnglib = require("pnglib");
svg4everybody = require("svg4everybody");

function d2h(d) {
    return d.toString(16);
}

function h2d(h) {
    return parseInt(h, 16);
}

function stringToHex(tmp) {
    var str = '',
        i = 0,
        tmp_len = tmp.length,
        c;

    for (; i < tmp_len; i += 1) {
        c = tmp.charCodeAt(i)
        str += d2h(c) + ' ';
    }
    return str;
}

function hexToString(tmp) {
    var arr = tmp.split(' '),
        str = '',
        i = 0,
        arr_len = arr.length,
        c;

    for (; i < arr_len; i += 1) {
        c = String.fromCharCode(h2d(arr[i]));
        str += c;
    }

    return str;
}



generateUUID = (typeof(window.crypto) != 'undefined' &&
        typeof(window.crypto.getRandomValues) != 'undefined') ?
    function() {
        // If we have a cryptographically secure PRNG, use that
        // https://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
        var buf = new Uint16Array(8);
        window.crypto.getRandomValues(buf);
        var S4 = function(num) {
            var ret = num.toString(16);
            while (ret.length < 4) {
                ret = "0" + ret;
            }
            return ret;
        };
        return (S4(buf[0]) + S4(buf[1]) + "-" + S4(buf[2]) + "-" + S4(buf[3]) + "-" + S4(buf[4]) + "-" + S4(buf[5]) + S4(buf[6]) + S4(buf[7]));
    }

:

function() {
    // Otherwise, just use Math.random
    // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};



marked.setOptions({
    "gfm": true,
    "breaks": true,
    "sanitize": true,
    "smartLists": true,
    "smartypants": true,
    "highlight": function(code) {

        // console.log("Highlighting >> ", code)
        return hljs.highlightAuto(code).value;
    }
});

var markedR = new marked.Renderer();
markedR.link = function(href, title, text) {
    var href = href || '',
        title = title || '',
        text = text || '';

    if (this.options.sanitize) {
        try {
            var prot = decodeURIComponent(unescape(href))
                .replace(/[^\w:]/g, '')
                .toLowerCase();
        } catch (e) {
            return '';
        }
        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
            return '';
        }
    }

    return '<a href="' + href + '" onclick="return openNewTab(\'' + href + '\');" ' + (title ? ('title="' + title + '"') : '') + '>' + text + '</a>';
};



openNewTab = function(url) {
    page.cmd("wrapperOpenWindow", [url, "_blank", ""]);
    return false;
}



Vue.use(VueZeroFrameRouter.VueZeroFrameRouter);

app = new Vue({
    el: '#app',
    template: `
        <div class="off-canvas">
            <navbar v-on:toggleLeftSidebar="toggleLeftSidebar" v-on:logIn="logIn" v-on:logOut="logOut"
            v-bind:userInfo="userInfo" v-bind:siteInfo="siteInfo"
            v-on:setSearch="setSearch"></navbar>
            <div id="sidebar-left" v-bind:class="'app-sidebar off-canvas-sidebar ' + (leftSidebarShown ? 'active' : '')">
                <div class="app-brand">
                    <route-link to="" class="app-logo">
                        <img src="" />
                        <h2>Thundote</h2>
                    </route-link>
                </div>
                <div class="app-nav">
                    <ul class="menu">
                        <!--<avatar v-if="isLoggedIn" v-bind:cert_user_id="userInfo.cert_user_id"></avatar>
                        <avatar v-else cert_user_id=""></avatar>
                        <li class="divider"></li>-->
                        <li class="menu-item">
                            <div v-if="checkReminders()" class="menu-badge">
                                <label class="label label-primary">{{ checkReminders() }}</label>
                            </div>
                            <route-link to="app/reminders">
                                <i class="mdi">{{ checkReminders() ? 'notifications' : 'notifications_none' }}</i> Reminders
                            </route-link>
                        </li>
                        <li class="divider"></li>
                        <li class="menu-item">
                            <a href="./?/app/local" v-on:click.prevent="goto('/app/local'); setGetList('l')">
                                <i class="mdi">cloud_off</i> Local notes
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="./?/app/synced" v-on:click.prevent="goto('/app/synced'); setGetList('s')">
                                <i class="mdi">cloud</i> Synced notes
                            </a>
                        </li>
                        <li class="divider"></li>
                        <li class="menu-item">
                            <a href="./?/app/shared" v-on:click.prevent="goto('/app/shared'); setGetList('sh')">
                                <i class="mdi">cloud_upload</i> Own shared notes
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="./?/app/oshared" v-on:click.prevent="goto('/app/oshared'); setGetList('osh')">
                                <i class="mdi">cloud_download</i> Others shared notes
                            </a>
                        </li>
                        <li class="divider"></li>
                        <li class="menu-item">
                            <route-link to="app/settings"><i class="mdi">settings</i> Settings</route-link>
                        </li>
                        <li class="divider" data-content="LINKS"></li>
                        <li class="menu-item">
                            <a href="https://github.com/AnthyG/Thundote" v-on:click.prevent="return openNewTab('https://github.com/AnthyG/Thundote');">
                                <i class="icon icon-link"></i> GitHub
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        
            <a class="off-canvas-overlay" href="#close" v-on:click.prevent="toggleLeftSidebar(false)"></a>
        
            <div class="off-canvas-content" style="padding-left: .4rem;">
                <div class="#container #grid-xl">
                    <component ref="view" v-bind:is="currentView"
                    v-on:getUserInfo="getUserInfo" v-on:logIn="logIn" v-on:logOut="logOut"
                    v-bind:userInfo="userInfo" v-bind:siteInfo="siteInfo"

                    v-on:getReminders="getReminders" v-bind:checkReminders="checkReminders" v-bind:reminders="reminders"
                    v-bind:getLists="getLists()" v-bind:getListsN="getLists(true)"

                    v-on:addNote="addNote" v-bind:colors="colors"
                    v-on:editNote="editNote" v-on:todoToggle="todoToggle" v-on:colorChange="colorChange" v-on:orderNotes="orderNotes"
                    v-on:deleteNote="deleteNote"

                    v-on:setGetList="setGetList" v-on:getNoteList="getNoteList" v-bind:getList="getList" v-bind:noteList="p_noteList"
                    v-on:setSearch="setSearch" v-bind:searchFor="searchFor"></component>
                </div>
            </div>
        </div>
    `,
    data: {
        out: null,
        currentView: null,
        serverInfo: null,
        siteInfo: null,
        userInfo: null,
        leftSidebarShown: false,
        getList: "l",
        noteList: null,
        noteListL: null,
        p_noteList: null,
        searchFor: '',
        reminders: null
    },
    computed: {
        isLoggedIn: function() {
            if (this.userInfo == null) return false;
            return this.userInfo.cert_user_id != null;
        },
        colors: function() {
            var colors = ["grey-100"];

            var colornames = ["red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green", "light-green", "lime", "yellow", "amber", "orange", "deep-orange"];
            var suffix = "-a100";

            for (var x = 0; x < colornames.length; x++) {
                var y = colornames[x];
                colors.push(y + suffix);
            }

            colors.push("blue-grey-100", "brown-100");

            return colors;
        }
    },
    methods: {
        toggleLeftSidebar: function(to) {
            if (to && typeof to === "boolean")
                this.leftSidebarShown = to;
            else
                this.leftSidebarShown = !this.leftSidebarShown;
        },
        logIn: function() {
            if (this.siteInfo == null) {
                return;
            }

            var dis = this;

            page.selectUser(function() {
                console.log("User selected; Logging in..");
                page.verifyUserFiles(undefined, function() {
                    console.log("Logged in");

                    dis.getList = "l";
                    dis.noteList = null;
                    dis.noteListL = null;
                    dis.p_noteList = null;
                    dis.reminders = null;

                    dis.getUserInfo();
                    dis.goto('/app');

                    dis.getNoteList(dis.getList, true);
                    dis.getReminders();
                });
            });
        },
        logOut: function() {
            var dis = this;

            page.signOut(function() {
                dis.getList = "l";
                dis.noteList = null;
                dis.noteListL = null;
                dis.p_noteList = null;
                dis.reminders = null;

                console.log("Logged out");

                dis.getUserInfo();
                dis.goto('');
            });
        },
        goto: function(to) {
            this.leftSidebarShown = false;
            Router.navigate(to);
        },
        getUserInfo: function() {
            if (this.siteInfo == null || this.siteInfo.cert_user_id == null) {
                this.userInfo = null;
                return;
            }

            console.log("Getting user-info", JSON.parse(JSON.stringify(this.siteInfo)));

            var dis = this;

            dis.userInfo = {
                json_id: null,
                public_key: null,
                cert_user_id: dis.siteInfo.cert_user_id,
                auth_address: dis.siteInfo.auth_address
            };

            page.cmd("dbQuery", [
                "SELECT * FROM extra_data LEFT JOIN json USING (json_id) WHERE auth_address = '" + dis.siteInfo.auth_address + "'"
            ], (res) => {
                if (!res || res.length !== 1 || !res[0]) return false;

                var user = res[0];

                dis.userInfo = {
                    json_id: user.json_id,
                    public_key: user.public_key,
                    cert_user_id: dis.siteInfo.cert_user_id,
                    auth_address: dis.siteInfo.auth_address
                };

                console.log("Got user-info", res, user, dis.siteInfo, dis.userInfo);

                dis.getReminders();

                if (Router.currentRoute === "")
                    dis.goto('/app');
            });
        },
        getReminders: function() {
            if (!this.isLoggedIn) return false;

            this.reminders = [{
                uuid: "UUID",
                rtime: moment().add(2, 'hours').format("x")
            }];

            console.log("Got reminders", this.reminders);
        },
        checkReminders: function() {
            if (!this.isLoggedIn) return false;

            if (this.reminders !== null && this.reminders.length > -1) {
                return this.reminders.length;
            }
            return false;
        },
        setSearch: function(s) {
            if (!this.isLoggedIn) return false;

            console.log("Setting searchFor", s);
            if (typeof s === "string")
                this.searchFor = s;
        },
        getLists: function(n) {
            if (!this.isLoggedIn) return false;

            var n = n ? true : false;

            var lists = ["l", "s", "sh", "osh"];
            var listsn = ["local", "synced", "shared", "others shared"];

            return n ? listsn : lists;
        },
        setGetList: function(to, forceget) {
            if (!this.isLoggedIn) return false;

            var forceget = forceget === true ? true : false;

            var lists = this.getLists();

            if (to === true) {
                var ni = lists.indexOf(this.getList) + 1;
                ni = ni < lists.length ? ni : 0;
                var to = lists[ni];
            } else if (lists.indexOf(to) === -1) to = "l";

            this.getList = to;
            this.getNoteList(to, forceget);
        },
        getNoteList: function(l, forceget) {
            if (!this.isLoggedIn) return false;

            var lists = this.getLists();

            var l = lists.indexOf(l) !== -1 ? l : (lists.indexOf(this.getList) !== -1 ? this.getList : "l");

            var forceget = forceget === true ? true : false;
            var ncl = l === "s" ? this.noteList : this.noteListL;
            console.log("Getting noteList", forceget, l, ncl);
            if (!forceget && ncl !== null) {
                this.getList = l;
                this.p_noteList = ncl;
                return false;
            }

            // this.noteList = null;
            // this.noteListL = null;
            this.p_noteList = null;

            var dis = this;

            var decryptor = function(data, cb) {
                var decryptList = [];

                var dnl = data.length;

                for (var x = 0; x < dnl; x++) {
                    var y = data[x];

                    if (typeof y.todoCheck === "boolean")
                        continue;

                    decryptList.push(y.title);
                    decryptList.push(y.body);
                    decryptList.push(y.todoCheck);
                    decryptList.push(y.color);
                    decryptList.push(y.lastedited);
                }

                var dnlT = 5;

                page.cmd("eciesDecrypt", [
                    decryptList
                ], (res) => {
                    // console.log("Decrypted local note-stuff", res);

                    var c_noteList = [];

                    for (var x = 0; x < dnl * dnlT; x += dnlT) {
                        var y = data[x / dnlT];

                        // console.log("Reading local notes", x, x / 4, y);

                        c_noteList[x / dnlT] = {};

                        c_noteList[x / dnlT].uuid = y.uuid;
                        c_noteList[x / dnlT].title = res[x] !== null ? res[x] : y.title;
                        c_noteList[x / dnlT].body = res[x + 1] !== null ? res[x + 1] : y.body;
                        c_noteList[x / dnlT].todoCheck = y.encrypted ? res[x + 2] : (res[x + 2] === "true" ? true : false /*  || y.todoCheck */ );
                        c_noteList[x / dnlT].color = res[x + 3] !== null ? res[x + 3] : y.color;
                        c_noteList[x / dnlT].lastedited = res[x + 4] !== null ? res[x + 4] : y.lastedited;
                        c_noteList[x / dnlT].encrypted = y.encrypted;

                        // c_noteList[x / dnlT].todoCheck = res[x + 2] === "true" ? true : false || y.todoCheck;
                    }

                    console.log("Got noteList", c_noteList);

                    typeof cb === "function" && cb(c_noteList);
                });
            };

            var decryptor2 = function(data, key2, cb) {
                var decryptList = [];

                var key = btoa(key2);
                var iv = key;

                var dnl = data.length;

                for (var x = 0; x < dnl; x++) {
                    var y = data[x];

                    if (typeof y.todoCheck === "boolean")
                        continue;

                    decryptList.push([iv, y.title]);
                    decryptList.push([iv, y.body]);
                    decryptList.push([iv, y.todoCheck]);
                    decryptList.push([iv, y.color]);
                    decryptList.push([iv, y.lastedited]);
                }

                var dnlT = 5;

                page.cmd("aesDecrypt", [
                    decryptList, [key]
                ], (res) => {
                    // console.log("Decrypted local note-stuff", res);

                    var c_noteList = [];

                    for (var x = 0; x < dnl * dnlT; x += dnlT) {
                        var y = data[x / dnlT];

                        // console.log("Reading local notes", x, x / 4, y);

                        c_noteList[x / dnlT] = {};

                        c_noteList[x / dnlT].uuid = y.uuid;
                        c_noteList[x / dnlT].title = res[x] || y.title;
                        c_noteList[x / dnlT].body = res[x + 1] || y.body;
                        c_noteList[x / dnlT].todoCheck = res[x + 2] === "true" ? true : false || y.todoCheck;
                        c_noteList[x / dnlT].color = res[x + 3] || y.color;
                        c_noteList[x / dnlT].lastedited = res[x + 4] || y.lastedited;
                        c_noteList[x / dnlT].encrypted = y.encrypted;
                    }

                    console.log("Got noteList 2", c_noteList);

                    typeof cb === "function" && cb(c_noteList);
                });
            };

            if (l === "s") {
                page.cmd("dbQuery", [
                    "SELECT notes.json_id," +
                    " notes.uuid, notes.title, notes.body, notes.todoCheck, notes.color, notes.lastedited, notes.encrypted," +
                    " extra_data.auth_address, extra_data.public_key" +
                    " FROM notes" +
                    " JOIN extra_data USING (json_id)" +
                    " WHERE auth_address = '" + app.userInfo.auth_address + "'"
                ], (notes) => {
                    if (notes) {
                        decryptor(notes, function(c_noteList) {
                            // decryptor2(c_noteList_, key, function(c_noteList) {
                            dis.getList = "s";
                            dis.noteList = c_noteList;
                            dis.p_noteList = c_noteList;
                            // });
                        });
                    }
                });
            } else if (l === "l") {
                var data2_inner_path = "data/users/" + this.siteInfo.auth_address + "/data_private.json";
                page.cmd("fileGet", {
                    "inner_path": data2_inner_path,
                    "required": false
                }, (data) => {
                    var data = data ? JSON.parse(data) : {};

                    if (data) {
                        decryptor(data.local_notes, function(c_noteList) {
                            // decryptor2(c_noteList_, key, function(c_noteList) {
                            dis.getList = "l";
                            dis.noteListL = c_noteList;
                            dis.p_noteList = c_noteList;
                            // });
                        });
                    }
                });
            }
        },
        addNote: function(note, sync, key) {
            if (!this.isLoggedIn) return false;

            // if (!note.title || !note.body) return false;
            console.log("Adding note..", note, sync, key);
            var note = note || {
                "uuid": generateUUID(),
                "title": "",
                "body": "",
                "todoCheck": false,
                "color": "grey-100",
                "lastedited": moment().format("x"),
                "encrypted": (key ? true : false)
            };

            var sync = sync === true ? true : (this.getList === "s" ? true : false);

            var key = typeof key === "string" ? key : "";

            var nNote = {
                "uuid": note.uuid,
                "title": "",
                "body": "",
                "todoCheck": "",
                "color": "",
                "lastedited": "",
                "encrypted": note.encrypted
            };

            if (sync)
                this.noteList.push(note);
            else
                this.noteListL.push(note);

            this.goto('/note/' + note.uuid);

            var data_inner_path = "data/users/" + this.userInfo.auth_address + "/data.json";
            var data2_inner_path = "data/users/" + this.userInfo.auth_address + "/data_private.json";
            var content_inner_path = "data/users/" + this.userInfo.auth_address + "/content.json";

            if (sync) {
                page.cmd("fileGet", {
                    "inner_path": data_inner_path,
                    "required": false
                }, (data) => {
                    var data = data ? JSON.parse(data) : {};

                    console.log("Adding synced note", data);

                    encryptor(note, nNote, function(nNote_) {
                        data.notes.push(nNote_);
                        writeBlaTo(0, data);
                    });
                });
            } else {
                page.cmd("fileGet", {
                    "inner_path": data2_inner_path,
                    "required": false
                }, (data) => {
                    var data = data ? JSON.parse(data) : {};

                    console.log("Adding local note", data);

                    encryptor(note, nNote, function(nNote_) {
                        data.local_notes.push(nNote_);
                        writeBlaTo(1, data);
                    });
                });
            }
        },
        todoToggle: function(note, to) {
            if (!this.isLoggedIn) return false;

            var uuid = note.uuid;
            var nid;

            var sync = sync === true ? true : (this.getList === "s" ? true : false);

            var editableNotes = this.p_noteList.filter(function(a, b) {
                nid = a.uuid === uuid ? b : nid;
                return a.uuid === uuid;
            });
            if (editableNotes.length !== 1) return false;
            var nNote = editableNotes[0];

            nNote.todoCheck = (typeof to === "boolean" ? to : !nNote.todoCheck);

            this.editNote(nNote);
            // this.p_noteList[nid] = nNote;

            console.log("Toggled todo-state of note", uuid, nNote.todoCheck);
        },
        colorChange: function(note, to) {
            if (!this.isLoggedIn) return false;

            if (this.colors.indexOf(to) === -1) return false;

            var uuid = note.uuid;
            var nid;

            var sync = sync === true ? true : (this.getList === "s" ? true : false);

            var editableNotes = this.p_noteList.filter(function(a, b) {
                nid = a.uuid === uuid ? b : nid;
                return a.uuid === uuid;
            });
            if (editableNotes.length !== 1) return false;
            var nNote = editableNotes[0];

            nNote.color = to;

            this.editNote(nNote);

            console.log("Changed color of note", uuid, nNote.color);
        },
        editNote: function(note) {
            if (!this.isLoggedIn) return false;

            var uuid = note.uuid;
            var nid;

            var sync = sync === true ? true : (this.getList === "s" ? true : false);

            var editableNotes = this.p_noteList.filter(function(a, b) {
                nid = a.uuid === uuid ? b : nid;
                return a.uuid === uuid;
            });
            if (editableNotes.length !== 1) return false;
            var nNote = editableNotes[0];

            var tNote = {
                "uuid": "",
                "title": "",
                "body": "",
                "todoCheck": false,
                "color": "",
                "lastedited": 0,
                "encrypted": false
            };

            for (var x in nNote) {
                if (note.hasOwnProperty(x) && typeof tNote[x] === typeof note[x]) {
                    nNote[x] = note[x];
                }
            }
            nNote.lastedited = moment().format("x");

            // this.p_noteList[nid] = JSON.parse(JSON.stringify(nNote));

            var data_inner_path = "data/users/" + this.userInfo.auth_address + "/data.json";
            var data2_inner_path = "data/users/" + this.userInfo.auth_address + "/data_private.json";
            var content_inner_path = "data/users/" + this.userInfo.auth_address + "/content.json";

            var dis = this;

            if (sync) {
                page.cmd("fileGet", {
                    "inner_path": data_inner_path,
                    "required": false
                }, (data) => {
                    var data = data ? JSON.parse(data) : {};

                    console.log("Editing synced note", data, nid, JSON.parse(JSON.stringify(nNote)));

                    encryptor(JSON.parse(JSON.stringify(nNote)), JSON.parse(JSON.stringify(nNote)), function(nNote_) {
                        data.notes[nid] = nNote_;
                        writeBlaTo(0, JSON.parse(JSON.stringify(data)), function() {
                            // dis.getNoteList("s");
                        });
                    });
                });
            } else {
                page.cmd("fileGet", {
                    "inner_path": data2_inner_path,
                    "required": false
                }, (data) => {
                    var data = data ? JSON.parse(data) : {};

                    console.log("Editing local note", data, nid, JSON.parse(JSON.stringify(nNote)));

                    encryptor(JSON.parse(JSON.stringify(nNote)), JSON.parse(JSON.stringify(nNote)), function(nNote_) {
                        data.local_notes[nid] = nNote_;
                        writeBlaTo(1, JSON.parse(JSON.stringify(data)), function() {
                            // dis.getNoteList("l");
                        });
                    });
                });
            }
        },
        orderNotes: function(e) {
            if (!this.isLoggedIn) return false;

            var sync = sync === true ? true : (this.getList === "s" ? true : false);

            console.log("Ordering notes", e);

            var onid,
                nid;

            e.layout.items.forEach(function(item, i) {
                if (e.element === item.element) {
                    console.log(item, i, item.element.getAttribute("index"));

                    onid = parseInt(item.element.getAttribute("index"));
                    nid = i;
                }
            });

            var r_onid = this.p_noteList.length - onid - 1;
            var r_nid = this.p_noteList.length - nid - 1;

            var cNote1 = JSON.parse(JSON.stringify(this.p_noteList[r_onid]));
            var cNote2 = JSON.parse(JSON.stringify(this.p_noteList[r_nid]));
            console.log(onid, r_onid, nid, r_nid, cNote1, cNote2);

            // this.p_noteList.splice(r_onid, 1);
            // this.p_noteList.splice(r_nid, 0, cNote1);

            // if (sync) {
            //     var r_onid = this.noteList.length - onid;
            //     console.log(onid, r_onid, this.noteList[r_onid]);
            // } else {
            //     var r_onid = this.noteListL.length - onid;
            //     console.log(onid, r_onid, this.noteListL[r_onid]);
            // }
        },
        deleteNote: function(note) {
            if (!this.isLoggedIn) return false;

            var uuid = note.uuid;
            var nid = null;

            var sync = sync === true ? true : (this.getList === "s" ? true : false);

            var editableNotes = this.p_noteList.filter(function(a, b) {
                nid = a.uuid === uuid ? b : nid;
                return a.uuid === uuid;
            });
            if (editableNotes.length !== 1) return false;

            // console.log("Deleting note..", note, nid, editableNotes);

            if (sync)
                this.noteList.splice(nid, 1);
            else
                this.noteListL.splice(nid, 1);

            var data_inner_path = "data/users/" + this.userInfo.auth_address + "/data.json";
            var data2_inner_path = "data/users/" + this.userInfo.auth_address + "/data_private.json";
            var content_inner_path = "data/users/" + this.userInfo.auth_address + "/content.json";

            var dis = this;

            if (sync) {
                page.cmd("fileGet", {
                    "inner_path": data_inner_path,
                    "required": false
                }, (data) => {
                    var data = data ? JSON.parse(data) : {};

                    console.log("Deleting synced note", data, nid, JSON.parse(JSON.stringify(note)));

                    data.notes.splice(nid, 1);
                    writeBlaTo(0, JSON.parse(JSON.stringify(data)), function() {
                        // dis.getNoteList("s");
                    });
                });
            } else {
                page.cmd("fileGet", {
                    "inner_path": data2_inner_path,
                    "required": false
                }, (data) => {
                    var data = data ? JSON.parse(data) : {};

                    console.log("Deleting local note", data, nid, JSON.parse(JSON.stringify(note)));

                    data.local_notes.splice(nid, 1);
                    writeBlaTo(1, JSON.parse(JSON.stringify(data)), function() {
                        // dis.getNoteList("l");
                    });
                });
            }
        }
    }
});



class Page extends ZeroFrame {
    verifyUserFiles(cb1, cb2, forcesign) {
        var forcesign = forcesign ? true : false;
        console.log("Verifying User Files...", forcesign);

        if (!page.site_info.cert_user_id) return false;

        var data_inner_path = "data/users/" + page.site_info.auth_address + "/data.json";
        var data2_inner_path = "data/users/" + page.site_info.auth_address + "/data_private.json";
        var content_inner_path = "data/users/" + page.site_info.auth_address + "/content.json";

        var curpversion = 1;

        function verifyData2(cb1, cb2) {
            page.cmd("fileGet", {
                "inner_path": data2_inner_path,
                "required": false
            }, (data) => {
                // console.log("BEFORE 1", JSON.parse(JSON.stringify(data)));
                if (data)
                    var data = JSON.parse(data);
                else
                    var data = {};
                var olddata = JSON.parse(JSON.stringify(data));
                // console.log("BEFORE 2", JSON.parse(JSON.stringify(olddata)));

                if (data.pversion !== curpversion)
                    data = {
                        "pversion": curpversion
                    };

                if (!data.hasOwnProperty("local_notes"))
                    data.local_notes = [];

                console.log("VERIFIED data_private.json", JSON.parse(JSON.stringify(olddata)), JSON.parse(JSON.stringify(data)));

                var json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')));
                var json_rawA = btoa(json_raw);

                if (JSON.stringify(data) !== JSON.stringify(olddata)) {
                    console.log("data_private.json HAS RECEIVED A UPDATE!");
                    page.cmd("fileWrite", [
                        data2_inner_path,
                        json_rawA
                    ], (res) => {
                        if (res == "ok") {
                            console.log("data_private.json HAS BEEN UPDATED!");
                        } else {
                            page.cmd("wrapperNotification", [
                                "error", "File write error: " + JSON.stringify(res)
                            ]);
                        }
                    });
                }
            });
            verifyData(cb1, cb2);
        }

        function verifyData(cb1, cb2) {
            page.cmd("fileGet", {
                "inner_path": data_inner_path,
                "required": false
            }, (data) => {
                if (data)
                    var data = JSON.parse(data);
                else
                    var data = {};
                var olddata = JSON.parse(JSON.stringify(data));

                if (!data.hasOwnProperty("notes"))
                    data.notes = [];

                if (!data.hasOwnProperty("shared"))
                    data.shared = [];

                if (data.hasOwnProperty("public_key"))
                    delete data.public_key;

                if (!data.hasOwnProperty("extra_data") || !data.extra_data[0])
                    data.extra_data = [{}];

                if (!data.extra_data[0].hasOwnProperty("auth_address"))
                    data.extra_data[0].auth_address = page.site_info.auth_address;

                if (!data.extra_data[0].hasOwnProperty("public_key") || !data.extra_data[0].public_key) {
                    page.cmd("userPublickey", [], (public_key) => {
                        data.extra_data[0].public_key = public_key;
                        verifyData_2(data, olddata, cb1, cb2);
                    });
                } else {
                    verifyData_2(data, olddata, cb1, cb2);
                }
            });
        }

        function verifyData_2(data, olddata, cb1, cb2) {
            console.log("VERIFIED data.json", olddata, data);

            if (JSON.stringify(data) !== JSON.stringify(olddata)) {
                console.log("data.json HAS RECEIVED A UPDATE!");

                var json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')));
                var json_rawA = btoa(json_raw);

                page.cmd("fileWrite", [
                    data_inner_path,
                    json_rawA
                ], (res) => {
                    if (res == "ok") {
                        console.log("data.json HAS BEEN UPDATED!");

                        if (typeof cb1 === "function")
                            cb1(data, olddata, true);
                        verifyContent(data, olddata, cb2);
                    } else {
                        page.cmd("wrapperNotification", [
                            "error", "File write error: " + JSON.stringify(res)
                        ]);
                    }
                });
            } else {
                if (typeof cb1 === "function")
                    cb1(data, olddata, false);
                verifyContent(data, olddata, cb2);
            }
        }

        function verifyContent(data, olddata, cb2) {
            page.cmd("fileGet", {
                "inner_path": content_inner_path,
                "required": false
            }, (data2) => {
                if (data2)
                    var data2 = JSON.parse(data2);
                else
                    var data2 = {};
                var olddata2 = JSON.parse(JSON.stringify(data2));

                var curoptional = ""; // ".+\\.(png|jpg|jpeg|gif|mp3|ogg|mp4)"
                var curignore = "(data(?:_private)?.json)"; // "(?!(.+\\.(png|jpg|jpeg|gif|mp3|ogg|mp4)|data.json))"
                if (!data2.hasOwnProperty("optional") || data2.optional !== curoptional)
                    data2.optional = curoptional;
                if (!data2.hasOwnProperty("ignore") || data2.ignore !== curignore)
                    data2.ignore = curignore;
                if (!data2.hasOwnProperty("inner_path") || data2.inner_path !== content_inner_path) {
                    data2.inner_path = content_inner_path;
                }
                console.log("VERIFIED content.json", olddata2, data2);

                if (JSON.stringify(data2) !== JSON.stringify(olddata2) || JSON.stringify(data) !== JSON.stringify(olddata) || forcesign) {
                    console.log("content.json HAS RECEIVED A UPDATE!");

                    var json_raw2 = unescape(encodeURIComponent(JSON.stringify(data2, undefined, '\t')));
                    var json_rawA2 = btoa(json_raw2);

                    page.cmd("fileWrite", [
                        content_inner_path,
                        json_rawA2
                    ], (res) => {
                        if (res == "ok") {
                            console.log("content.json HAS BEEN UPDATED!");
                            if (typeof cb2 === "function")
                                cb2(data2, olddata2, true);
                            page.cmd("siteSign", {
                                "inner_path": content_inner_path
                            }, (res) => {
                                page.cmd("sitePublish", {
                                    "inner_path": content_inner_path,
                                    "sign": false
                                }, function() {});
                            });
                        } else {
                            page.cmd("wrapperNotification", [
                                "error", "File write error: " + JSON.stringify(res)
                            ]);
                        }
                    });
                } else {
                    if (typeof cb2 === "function")
                        cb2(data2, olddata2, false);
                }
            });
        }

        verifyData2(cb1, cb2);
    }

    selectUser(cb) {
        this.cmd("certSelect", {
            accepted_domains: [
                "zeroid.bit",
                "kaffie.bit",
                "cryptoid.bit"
            ]
        }, () => {
            typeof cb === "function" && cb();
        });
        return false;
    }

    signOut(cb) {
        this.cmd("certSelect", {
            accepted_domains: [""]
        }, () => {
            typeof cb === "function" && cb();
        });
    }

    onRequest(cmd, message) {
        Router.listenForBack(cmd, message);

        if (cmd == "setSiteInfo") {
            this.site_info = message.params;
            app.siteInfo = message.params;
            this.setSiteInfo(message.params);

            app.getUserInfo();
        } else
            this.log("Unknown incoming message:", cmd);
    }

    setSiteInfo(site_info) {
        app.out =
            "Page address: " + site_info.address +
            "<br>- Peers: " + site_info.peers +
            "<br>- Size: " + site_info.settings.size +
            "<br>- Modified: " + (new Date(site_info.content.modified * 1000));
    }

    onOpenWebsocket() {
        this.cmd("siteInfo", [], function(site_info) {
            page.site_info = site_info;
            app.siteInfo = site_info;

            page.verifyUserFiles(undefined, undefined, true);

            // if (site_info.cert_user_id) {
            app.getUserInfo();

            page.setSiteInfo(site_info);

            page.cmd("serverInfo", [], (res) => {
                app.serverInfo = res;
            });

            var Note = require("./router_pages/note.js");
            var Reminders = require("./router_pages/reminders.js");
            var Settings = require("./router_pages/settings.js");
            var Home = require("./router_pages/home.js");

            VueZeroFrameRouter.VueZeroFrameRouter_Init(Router, app, [
                { route: "note/:uuid", component: Note },
                { route: "app/reminders", component: Reminders },
                { route: "app/settings", component: Settings },
                { route: "app/:list/:search", component: Home },
                { route: "app/:list", component: Home },
                { route: "app", component: Home },
                { route: ":anything", component: Home },
                { route: "", component: Home }
            ]);
            // }
        });
    }
}
page = new Page();

var writeBlaTo = function(to, bla, cb1, cb2) {
    var data_inner_path = "data/users/" + app.siteInfo.auth_address + "/data.json";
    var data2_inner_path = "data/users/" + app.siteInfo.auth_address + "/data_private.json";
    var content_inner_path = "data/users/" + app.siteInfo.auth_address + "/content.json";

    var ip = to === 1 ? data2_inner_path : (to === 2 ? content_inner_path : data_inner_path);

    console.log("Writing", to, ip, bla);

    // Encode data array to utf8 json text
    var json_raw = unescape(encodeURIComponent(JSON.stringify(bla, undefined, '\t')));
    var json_rawA = btoa(json_raw);

    page.cmd("fileWrite", [
        ip,
        json_rawA
    ], (res) => {
        if (res == "ok") {
            var cbf = function() {
                console.log("Wrote", to, ip, bla);
                typeof cb1 === "function" && cb1(res, to, ip, bla);
            }
            if (to === 1)
                page.verifyUserFiles(null, cbf);
            else
                page.verifyUserFiles(cbf, null);
        } else {
            page.cmd("wrapperNotification", [
                "error", "File write error: " + JSON.stringify(res)
            ]);
            typeof cb2 === "function" && cb2(res, to, ip, bla);
        }
    });
};

encrypt = function(text, mode, key, iv, cb) {
    var mode = mode || 0;

    var key = key || "";
    var iv = iv || key || "";

    if (mode === 1 && key && iv) {
        var bR1 = btoa(key);
        var bR2 = btoa(iv);
        page.cmd("aesEncrypt", [
            text,
            bR1,
            bR2
        ], (res) => {
            typeof cb === "function" && cb(res, text, mode, key, iv, bR1, bR2);
        })
    } else if (mode === 0) {
        page.cmd("eciesEncrypt", [
            text
        ], (res) => {
            typeof cb === "function" && cb(res, text, mode, key, iv);
        });
    } else return false;
};

encryptor = function(note, nNote, cb, key) {
    var cb = typeof cb === "function" ? cb : undefined;

    var these = ["title", "body", "todoCheck", "color", "lastedited"];
    var thesetS = [false, false, true, false, false];

    var x2 = -1;
    var enc2 = false;
    var genEncryptorStr = function(x, mode) {
        var encryptorStr_ = ``;

        x2++;
        var x = x + 1;
        var y = these[x];

        var mode = mode === 1 ? 1 : 0;

        encryptorStr_ += `
            console.log("Now encrypting '` + y + `'..", n` + (mode === 0 && note.encrypted ? `N` : ``) + `ote_['` + y + `']);
            encrypt(n` + (mode === 0 && note.encrypted ? `N` : ``) + `ote_['` + y + `']` + (thesetS[x] ? `.toString()` : ``) +
            `, ` + mode + `, key_, "", function(res` + x2 + `, text` + x2 + `, mode` + x2 + `, key` + x2 + `, iv` + x2 + `, bR1` + x2 + `, bR2` + x2 + `) {
                // console.log("Encrypted '` + y + `'", [res` + x2 + `, text` + x2 + `, mode` + x2 + `, key` + x2 + `, iv` + x2 + `, bR1` + x2 + `, bR2` + x2 + `]);
                nNote_['` + y + `'] = res` + x2 + (mode === 1 ? `[2]` : ``) + `;
                `;

        if (x < these.length - 1) {
            encryptorStr_ += genEncryptorStr(x, mode);
        }

        if (x === these.length - 1 && !enc2 && note.encrypted) {
            encryptorStr_ += `
                console.log("Encrypting with ECIES!");`;
            enc2 = true;
            encryptorStr_ += genEncryptorStr(-1, 0);
        } else if (x === these.length - 1) {
            encryptorStr_ += `
                // console.log("Encryptor encrypted!", nNote_, note_);
                cb_(nNote_, note_);`;
        } else {
            // console.log(x === these.length - 1, enc2, note.encrypted);
        }

        encryptorStr_ += `
            });`;

        return encryptorStr_;
    };

    var encryptorStr = `(function(note_, nNote_, cb_, key_) {
        // console.log(note_, nNote_, cb_, key_);` +
        (note.encrypted ? genEncryptorStr(-1, 1) : genEncryptorStr(-1, 0)) + `
    })(note, nNote, cb, key);`;
    // console.log("Encryptor Str", encryptorStr);
    eval(encryptorStr);
};

function showError(msg) {
    page.cmd("wrapperNotification", [
        "error", msg
    ]);
}