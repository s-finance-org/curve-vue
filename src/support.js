/**
 *  NOTE:
 */

import { asyncLoadScript } from './utils/common'

/**
 *  Google Analytics
 */
export function googleAnalytics() {
  asyncLoadScript('https://www.googletagmanager.com/gtag/js?id=UA-176929380-1')

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-176929380-1');
}