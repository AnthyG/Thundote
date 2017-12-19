var ZeroFrame = require("./ZeroFrame.js");

var Vue = require("vue/dist/vue.min.js");

var Router = require("./router.js");

var VueZeroFrameRouter = require("./vue-zeroframe-router.js");

require("./vue_components/avatar.js");
require("./vue_components/navbar.js");
require("./vue_components/note.js");
require("./vue_components/noteLists.js");

var autosize = require("autosize");
var marked = require("marked");
var moment = require("moment");
var pnglib = require("pnglib");
var svg4everybody = require("svg4everybody");

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



function openNewTab(url) {
    page.cmd("wrapperOpenWindow", [url, "_blank", ""]);
    return false;
}



Vue.use(VueZeroFrameRouter.VueZeroFrameRouter);

app = new Vue({
    el: '#app',
    template: `
        <div class="off-canvas">
            <navbar v-on:toggleLeftSidebar="toggleLeftSidebar" v-on:logIn="logIn" v-on:logOut="logOut" v-bind:user-info="userInfo"
            v-on:setSearch="setSearch"></navbar>
            <div id="sidebar-left" v-bind:class="'app-sidebar off-canvas-sidebar ' + (leftSidebarShown ? 'active' : '')">
                <div class="app-brand">
                    <route-link to="" class="app-logo">
                        <img src="" />
                        <h2>Thundote</h2>
                    </route-link>
                </div>
            </div>
        
            <a class="off-canvas-overlay" href="#close" v-on:click.prevent="toggleLeftSidebar(false)"></a>
        
            <div class="off-canvas-content" style="padding-left: .4rem;">
                <div class="container grid-lg">
                    <component ref="view" v-bind:is="currentView"
                    v-on:addNote="addNote" v-on:editNote="editNote" v-on:todoToggle="todoToggle" v-on:deleteNote="deleteNote"
                    v-bind:getNoteList="getNoteList" v-bind:noteList="noteList" v-bind:searchFor="searchFor"></component>
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
        noteList: null,
        noteListP: null,
        searchFor: ''
    },
    computed: {
        isLoggedIn: function() {
            if (this.userInfo == null) return false;
            return this.userInfo.cert_user_id != null;
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
            page.selectUser();
        },
        logOut: function() {
            page.signOut();
        },
        goto: function(to) {
            this.leftSidebarShown = false;
            Router.navigate(to);
        },
        setSearch: function(s) {
            console.log("Setting searchFor", s);
            if (typeof s === "string")
                this.searchFor = s;
        },
        getUserInfo: function() {
            if (this.siteInfo == null || this.siteInfo.cert_user_id == null) {
                this.userInfo = null;
                return;
            }

            var dis = this;

            page.cmd("dbQuery", [
                "SELECT * FROM extra_data LEFT JOIN json USING (json_id) WHERE auth_address = '" + dis.siteInfo.auth_address + "'"
            ], (res) => {
                if (!res || res.length !== 1 || !res[0]) return false;

                var user = res[0];

                dis.userInfo = {
                    public_key: user.public_key,
                    cert_user_id: dis.siteInfo.cert_user_id,
                    auth_address: user.auth_address
                };

                console.log("Got user-info", res, user, dis.siteInfo, dis.userInfo);
            });
        },
        getNoteList: function() {
            // console.log(this);
            // if (!this.computed.isLoggedIn()) return false;

            this.noteList = [];
            // this.addNote();

            console.log("Got noteList", this.noteList);
        },
        addNote: function(note, key) {
            // if (!note.title || !note.body) return false;
            var note = note || {};

            var key = key || "";

            var nNote = {
                "uuid": generateUUID(),
                "title": note.title || generateUUID(),
                "body": note.body || generateUUID(),
                "todoCheck": note.todoCheck || false,
                "lasteditedenc": "",
                "lastedited": moment().format("x"),
                "encrypted": (key ? true : false)
            };

            this.noteList.push(nNote);

            var data_inner_path = "data/users/" + this.userInfo.auth_address + "/data.json"
            var data2_inner_path = "data/users/" + this.userInfo.auth_address + "/data_private.json"
            var content_inner_path = "data/users/" + this.userInfo.auth_address + "/content.json"

            var writeBlaTo = function(to, bla) {
                var ip = to === 1 ? data2_inner_path : (to === 2 ? content_inner_path : data_inner_path);

                console.log("Adding note 2", to, ip, bla);

                // Encode data array to utf8 json text
                var json_raw = unescape(encodeURIComponent(JSON.stringify(bla, undefined, '\t')));
                var json_rawA = btoa(json_raw);

                page.cmd("fileWrite", [
                    ip,
                    json_rawA
                ], (res) => {
                    if (res == "ok") {
                        page.verifyUserFiles(null, function() {
                            console.log("Added note", nNote);
                        });
                    } else {
                        page.cmd("wrapperNotification", [
                            "error", "File write error: " + JSON.stringify(res5)
                        ]);
                    }
                });
            };

            page.cmd("fileGet", {
                "inner_path": data2_inner_path,
                "required": false
            }, (data) => {
                var data = data ? JSON.parse(data) : {};

                console.log("Adding note", data);

                page.cmd("eciesEncrypt", [
                    JSON.stringify(nNote)
                ], (res1) => {
                    if (nNote.encrypted) {
                        var bR = btoa(key);

                        page.cmd("aesEncrypt", [
                            res1,
                            bR,
                            bR
                        ], (res2) => {
                            data.local_notes.push(res2);
                            writeBlaTo(1, data);
                        });
                    } else {
                        data.local_notes.push(res1);
                        writeBlaTo(1, data);
                    }
                });
            });
        },
        todoToggle: function(note, to) {
            var uuid = note.uuid;
            var nid;

            var editableNotes = this.noteList.filter(function(a, b) {
                nid = a.uuid === uuid ? b : nid;
                return a.uuid === uuid;
            });
            if (editableNotes.length !== 1) return false;

            editableNotes[0].todoCheck = (typeof to === "boolean" ? to : !editableNotes[0].todoCheck);

            this.noteList[nid] = editableNotes[0];

            console.log("Toggled todo-state of note", uuid, editableNotes[0].todoCheck);
        },
        editNote: function(note) {
            var uuid = note.uuid;
            var nid;

            var editableNotes = this.noteList.filter(function(a, b) {
                nid = a.uuid === uuid ? b : nid;
                return a.uuid === uuid;
            });
            if (editableNotes.length !== 1) return false;

            for (var x in editableNotes[0]) {
                if (note.hasOwnProperty(x)) {
                    editableNotes[0][x] = note[x];
                }
            }
            editableNotes[0].lastedited = moment().format("x");

            this.noteList[nid] = editableNotes[0];
        },
        deleteNote: function(note) {
            var uuid = note.uuid;
            var nid = null;

            var editableNotes = this.noteList.filter(function(a, b) {
                nid = a.uuid === uuid ? b : nid;
                return a.uuid === uuid;
            });

            console.log(nid, editableNotes);

            if (nid !== null) {
                this.noteList.splice(nid, 1);
                console.log("Deleted note", nid, uuid);
            }
        }
    }
});



class Page extends ZeroFrame {
    verifyUserFiles(cb1, cb2) {
        console.log("Verifying User Files...");

        var data_inner_path = "data/users/" + page.site_info.auth_address + "/data.json";
        var data2_inner_path = "data/users/" + page.site_info.auth_address + "/data_private.json";
        var content_inner_path = "data/users/" + page.site_info.auth_address + "/content.json";

        var curpversion = 1;

        function verifyData2(cb1, cb2) {
            page.cmd("fileGet", {
                "inner_path": data2_inner_path,
                "required": false
            }, (data) => {
                console.log("BEFORE 1", JSON.parse(JSON.stringify(data)));
                if (data)
                    var data = JSON.parse(data);
                else
                    var data = {};
                var olddata = JSON.parse(JSON.stringify(data));
                console.log("BEFORE 2", JSON.parse(JSON.stringify(olddata)));

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
                var curignore = "(?!(data(?:_private)?.json))"; // "(?!(.+\\.(png|jpg|jpeg|gif|mp3|ogg|mp4)|data.json))"
                if (!data2.hasOwnProperty("optional") || data2.optional !== curoptional)
                    data2.optional = curoptional;
                if (!data2.hasOwnProperty("ignore") || data2.ignore !== curignore)
                    data2.ignore = curignore;
                console.log("VERIFIED content.json", olddata2, data2);

                if (JSON.stringify(data2) !== JSON.stringify(olddata2) || JSON.stringify(data) !== JSON.stringify(olddata)) {
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

    selectUser(cb = null) {
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

    signOut(cb = null) {
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

            page.verifyUserFiles();

            // if (site_info.cert_user_id) {
            app.getUserInfo();

            page.setSiteInfo(site_info);

            page.cmd("serverInfo", [], (res) => {
                app.serverInfo = res;
            });
            // }
        });
    }
}
page = new Page();

var Home = require("./router_pages/home.js");

VueZeroFrameRouter.VueZeroFrameRouter_Init(Router, app, [
    { route: "", component: Home }
]);

function showError(msg) {
    page.cmd("wrapperNotification", [
        "error", msg
    ]);
}