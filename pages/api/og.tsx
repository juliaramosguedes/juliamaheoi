import { NextRequest } from 'next/server'
import React from 'react'

import { ImageResponse } from '@vercel/og'

import { api, apiHost, rootNotionPageId } from '@/lib/config'
import { NotionPageInfo } from '@/lib/types'

export const config = {
  runtime: 'edge'
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pageId = searchParams.get('id') || rootNotionPageId
  if (!pageId) {
    return new Response('Invalid notion page id', { status: 400 })
  }

  const interRegularFont = await fetch(
    new URL('../../public/fonts/Inter-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  const pageInfoRes = await fetch(`${apiHost}${api.getNotionPageInfo}`, {
    method: 'POST',
    body: JSON.stringify({ pageId }),
    headers: {
      'content-type': 'application/json'
    }
  })
  if (!pageInfoRes.ok) {
    return new Response(pageInfoRes.statusText, { status: pageInfoRes.status })
  }
  const pageInfo: NotionPageInfo = await pageInfoRes.json()

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1F2027',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Inter", sans-serif',
          color: 'black',
          overflow: 'hidden'
        }}
      >
        {pageInfo.image && (
          <img
            src={pageInfo.image}
            alt={pageInfo.title}
            style={{
              position: 'absolute',
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        )}

        <div
          style={{
            position: 'relative',
            width: 900,
            height: 465,
            display: 'flex',
            flexDirection: 'column',
            border: '16px solid rgba(0,0,0,0.3)',
            borderRadius: 8,
            zIndex: '1'
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              backgroundColor: '#fff',
              padding: 24,
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {pageInfo.detail && (
              <div style={{ fontSize: 32, opacity: 0 }}>{pageInfo.detail}</div>
            )}

            <div
              style={{
                fontSize: 70,
                fontWeight: 'bold',
                fontFamily: 'Inter'
              }}
            >
              {pageInfo.title}
            </div>

            {pageInfo.detail && (
              <div style={{ fontSize: 32, opacity: 0.6 }}>
                {pageInfo.detail}
              </div>
            )}
          </div>
        </div>

        {pageInfo.authorImage && (
          <div
            style={{
              position: 'absolute',
              top: 47,
              left: 104,
              height: 128,
              width: 128,
              display: 'flex',
              borderRadius: '50%',
              border: '4px solid #fff',
              zIndex: '5',
              overflow: 'hidden'
            }}
          >
            <img
              src={pageInfo.authorImage}
              alt={pageInfo.author}
              style={{
                position: 'absolute',
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interRegularFont,
          style: 'normal',
          weight: 400
        }
      ]
    }
  )
}
