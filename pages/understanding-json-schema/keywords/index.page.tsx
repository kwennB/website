import React from 'react';
import Head from 'next/head';

import fs from 'fs';
import { getLayout } from '~/components/Sidebar';
import yaml from 'js-yaml';
import { SectionContext } from '~/context';
import { Headline1, Headline4 } from '~/components/Headlines';
import { DocsHelp } from '~/components/DocsHelp';
import Link from 'next/link';
import Image from 'next/image';
import NextPrevButton from '~/components/NavigationButtons';

export async function getStaticProps() {
  const datas = yaml.load(
    fs.readFileSync('data/keywords.yml', 'utf-8'),
  ) as DataObject[];

  // Sort the data alphabetically by the 'name' keyword
  datas.sort((a, b) => a.name.localeCompare(b.name));

  return {
    props: {
      datas,
    },
  };
}

interface DataObject {
  name: string;
  vocabulary: string[];
  learnjsonschemalink: string;
  links?: LinkObject[];
}

interface LinkObject {
  url: string;
  title: string;
}

export default function StaticMarkdownPage({ datas }: { datas: DataObject[] }) {
  const fileRenderType = 'tsx';
  return (
    <SectionContext.Provider value={null}>
      <Head>
        <title>JSON Schema - keywords</title>
      </Head>
      <Headline1>JSON Schema keywords</Headline1>
      <p className='text-slate-600 block leading-7 dark:text-slate-300'>
        Keywords are the building blocks of JSON Schema and they are used to
        define the structure of a JSON document.
      </p>
      <p className='text-slate-600 block leading-7 dark:text-slate-300 pt-4'>
        Below is a list of JSON Schema keywords with links to their respective
        documentation.
      </p>
      <div className='mt-4'>
        {datas
          .sort((a: DataObject, b: DataObject) => a.name.localeCompare(b.name))
          .map(
            (data: DataObject, index: number) =>
              data.links && (
                <div key={index} className='mt-4'>
                  <div className='flex flex-row items-center gap-2'>
                    <Headline4>{data.name}</Headline4>
                    <Link href={data.learnjsonschemalink} target='_blank'>
                      <Image
                        src={'/icons/external-link.svg'}
                        height={20}
                        width={20}
                        className='mt-3'
                        alt='external link'
                        title='See at Learn JSON Schema'
                      />
                    </Link>
                  </div>
                  <ul className='mt-1 list-disc text-blue-500 ml-7'>
                    {data.links?.map((link: LinkObject, index: number) => (
                      <li key={index}>
                        <Link href={link.url} className=' hover:underline'>
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
          )}
      </div>
      <NextPrevButton
        prevLabel='JSON Schema reference'
        prevURL='/understanding-json-schema/reference'
        nextLabel='Type-specific Keywords'
        nextURL='/understanding-json-schema/reference/type'
      />
      <DocsHelp fileRenderType={fileRenderType} />
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
