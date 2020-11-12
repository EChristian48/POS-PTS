import { Link, LinkProps } from '@material-ui/core'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { FC } from 'react'

export type LinkWrapperProps = {
  nextProps: NextLinkProps
  materialProps?: LinkProps
}

const LinkWrapper: FC<LinkWrapperProps> = ({
  children,
  nextProps,
  materialProps: chakraProps,
}) => (
  <NextLink {...nextProps} passHref>
    <Link {...chakraProps}>{children}</Link>
  </NextLink>
)

export default LinkWrapper
