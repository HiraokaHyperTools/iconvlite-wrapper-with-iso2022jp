const iconv = require('iconv-lite');
const encoding = require('encoding-japanese');
const Transform = require('stream').Transform;

class Wrapper {
}

function shortenCharset(charset) {
    return charset.toLowerCase().replace(/-/g, "");
}

Wrapper.decode = (buffer, charset, options) => {
    if (shortenCharset(charset) == "iso2022jp") {
        return encoding.convert(buffer, {
            to: 'UNICODE',
            from: 'JIS',
            type: 'string'
        });
    }
    return iconv.decode(buffer, charset, options);
}

Wrapper.encode = iconv.encode;

Wrapper.encodingExists = iconv.encodingExists;

Wrapper.decodeStream = (charset) => {
    if (shortenCharset(charset) == "iso2022jp") {
        const converter = new Transform();
        converter._transform = (data, enc, callback) => {
            converter.push(encoding.convert(data, {
                to: 'UNICODE',
                from: 'JIS',
                type: 'string'
            }));
            callback();
        };
        return converter;
    }
    return iconv.decodeStream(charset);
};

Wrapper.encodeStream = iconv.encodeStream;

module.exports = Wrapper;
