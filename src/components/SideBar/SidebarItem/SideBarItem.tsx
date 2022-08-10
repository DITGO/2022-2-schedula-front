import { Url } from 'url';

import React, { ReactElement, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flex } from '@chakra-ui/react';
import { IRoute } from 'routes';

export interface SideBarItemAttributes extends IRoute {
  query?: { [key: string]: string };
  as?: string;
  isActive?: boolean;
}

export interface SideBarItemProps extends Partial<SideBarItemAttributes> {
  children?: ReactElement<{ isActive: boolean }>;
}

export const SideBarItem = ({
  pathname,
  query,
  as,
  label,
  icon,
}: SideBarItemProps) => {
  const router = useRouter();

  const href: Partial<Url> = useMemo(
    () => ({
      pathname,
      query,
    }),
    [pathname, query]
  );

  // replace the pathname slug '/path/[slug]' with the actual slug
  const path = query
    ? pathname?.replace(`[${Object.keys(query)[0]}]`, Object.values(query)[0])
    : pathname;
  const isActive = router?.asPath === path;

  return (
    <Link href={href} as={as} shallow={!pathname}>
      <Flex
        alignItems={'center'}
        gap={2}
        fontSize={18}
        fontWeight={'medium'}
        cursor='pointer'
        px={2}
        py={2.5}
        borderRadius={'base'}
        bg={isActive ? 'primary' : 'inherit'}
        color={isActive ? 'white' : 'inherit'}
        boxShadow={isActive ? 'soft' : 'none'}
        // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop -- não irei implementar uma classe que aplica hover
        _hover={{
          bg: 'primary',
          color: 'white',
          boxShadow: 'soft',
        }}
      >
        {icon} {label}
      </Flex>
    </Link>
  );
};
