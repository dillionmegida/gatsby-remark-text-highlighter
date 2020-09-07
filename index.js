const visit = require("unist-util-visit")
const toString = require("mdast-util-to-string")

module.exports = ({ markdownAST }, options) => {
  const {useDefaultStyles = true, className = ""} = options;

  visit(markdownAST, "paragraph", node => {
    let para = toString(node)
    
    // syntax for highlighting:
    // -# Hightlight me! #-
    const syntax = /-#.*#-/
    const matches = para.match(syntax)
    
    if (matches !== null) {

      let style = null

      if (useDefaultStyles) {
        style = `
          display:inline-block;
          padding:20px;
          background-color:yellow;
          color:black;
        `
      }
      
      // remove #- and -#
      const removeSymbols = text => text.replace(/-#/g, "").replace(/#-/g, "")

      const putTextInSpan = text =>
        `<span
          ${useDefaultStyles && style ? ` style='${style}'` : ""}
          ${className !== "" ? `class='${className}'` : ""}
        >${removeSymbols(text)}</span>`


      matches.map(match => {
        para = para.replace(match, putTextInSpan(match))
      })

      para = '<p>' + para + '</p>'

      node.type = "html"
      node.children = undefined
      node.value = para
    }
  })

  return markdownAST
}
