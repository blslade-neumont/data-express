

function q1Response(idx) {
    if (idx == '0') return 'Drop Bear';
    if (idx == '1') return 'Blobfish';
    if (idx == '2') return 'Hairless Cat';
    if (idx == '3') return 'Human';
    return 'ERR';
}
function q2Response(idx) {
    if (idx == '0') return 'Types';
    if (idx == '1') return 'Inheritance';
    if (idx == '2') return 'Syntax';
    if (idx == '3') return 'Readability';
    return 'ERR';
}
function q3Response(idx) {
    if (idx == '0') return 'Theodore Roosevelt';
    if (idx == '1') return 'James Garfield';
    if (idx == '2') return 'Millard Fillmore';
    if (idx == '3') return 'Herbert Hoover';
    return 'ERR';
}

module.exports = {
    q1Response: q1Response,
    q2Response: q2Response,
    q3Response: q3Response
}
