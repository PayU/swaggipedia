import * as React from 'react'
import classNames from 'classnames'

import './font-awesome.min.css'

export const FontAwesome = ({
  className,
  icon,
  ...props
}) => (
  <i data-test='FontAwesome' {...props} className={classNames(className, 'fa', `fa-${icon}`)} />
)

export default FontAwesome
