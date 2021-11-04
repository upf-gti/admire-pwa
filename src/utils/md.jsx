import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import ReactMarkdown from 'react-markdown'

export default ({children,...props}) => {
    return <ReactMarkdown children={children.replaceAll("  ","")} remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]} {...props}/>
}