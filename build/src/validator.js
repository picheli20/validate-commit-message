var PATTERN = /^(\w+)(?:\(([^)]+)\))?\: (.+)$/;
var FIXUP_SQUASH = /^(fixup|squash)\! /i;
var REVERT = /^revert:? /i;
exports.validateMessage = function (commitSubject, config) {
    var subject = commitSubject.replace(FIXUP_SQUASH, '');
    if (subject.match(REVERT)) {
        return true;
    }
    if (subject.length > config['maxLength']) {
        error("The commit message is longer than " + config['maxLength'] + " characters", commitSubject);
        return false;
    }
    var match = PATTERN.exec(subject);
    if (!match) {
        error("The commit message does not match the format of '<type>(<scope>): <subject>' OR 'Revert: \"type(<scope>): <subject>\"'", commitSubject);
        return false;
    }
    var type = match[1];
    if (config['types'].indexOf(type) === -1) {
        error(type + " is not an allowed type.\n => TYPES: " + config['types'].join(', '), commitSubject);
        return false;
    }
    var scope = match[2];
    if (scope && config['scopes'].indexOf(scope) === -1) {
        error("\"" + scope + "\" is not an allowed scope.\n => SCOPES: " + config['scopes'].join(', '), commitSubject);
        return false;
    }
    return true;
};
function error(errorMessage, commitMessage) {
    console.error("INVALID COMMIT MSG: \"" + commitMessage + "\"\n => ERROR: " + errorMessage);
}
