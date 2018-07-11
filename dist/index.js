"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
function generateFile(base, data, geschlechtConfig, template, id) {
    var eData;
    var tmp = {};
    switch (base) {
        case 'person':
            geschlechtConfig.forEach(function (v) {
                tmp[v.name] = v[data.geschlecht];
            });
            eData = __assign({}, data, tmp);
            break;
        case 'anmeldung':
            geschlechtConfig.forEach(function (v) {
                tmp[v.name] = v[data.person.geschlecht];
            });
            eData = data;
            eData.person = __assign({}, eData.person, tmp);
            break;
    }
    var doc = new Docxtemplater();
    doc.loadZip(new JSZip(Buffer.from(template, 'base64')));
    doc.setData(eData);
    doc.render();
    fs.writeFileSync(path.resolve(process.env.TEMP, id + '.docx'), doc.getZip().generate({ type: 'nodebuffer' }));
    return path.resolve(process.env.TEMP, id + '.docx');
}
exports.generateFile = generateFile;
