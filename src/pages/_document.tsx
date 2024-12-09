import { Html, Head, Main, NextScript } from "next/document";
import * as pdfjsLib from 'pdfjs-dist';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src={`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
