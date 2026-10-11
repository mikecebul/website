import Image from 'next/image'
import { Check } from 'lucide-react'

import {
  AngularFrame,
  PageCallToAction,
  PageFrame,
  WebsiteAction,
} from '@/components/marketing/design-system'
import { Separator } from '@/components/ui/separator'
import { websiteContent } from '@/lib/website-content'

const meetingServices = [
  {
    title: 'Room planning',
    body: 'Start with the room, the people, and the way you meet. Plan camera placement, microphones, displays, and the equipment that fits the space.',
  },
  {
    title: 'Zoom Rooms & AV integration',
    body: 'Bring video, audio, and presentation tools together into a clear meeting experience for the people at the table and the people joining remotely.',
  },
  {
    title: 'Meeting kiosks & simple controls',
    body: 'Give your team a straightforward place to start or join a meeting and share content. The kiosk pictured here is one of my installations in production.',
  },
  {
    title: 'Device management & support',
    body: 'Keep the system manageable after installation, with ongoing device management, practical support documentation, and someone local to call.',
  },
]

export function HybridMeetingSolutionsPage() {
  const offer = websiteContent.hybridMeetingOffer
  const inquiryHref = '/contact?inquiry=hybrid-meeting-solutions'
  return (
    <PageFrame className="web-hybrid-page">
      <section className="web-container web-hybrid-intro">
        <div className="web-hybrid-intro-copy">
          <p className="web-eyebrow">Hybrid meeting solutions · Northern Michigan</p>
          <h1 className="web-page-title">
            Hybrid meetings.
            <br />
            <span className="web-gold">Made simple.</span>
          </h1>
          <p className="web-copy">
            Zoom Rooms, meeting kiosks, and AV systems that help everyone feel present and heard.
            Planned around your room. Supported by someone local.
          </p>
          <WebsiteAction href={inquiryHref}>Let’s plan your meeting room</WebsiteAction>
          <p className="web-hybrid-location">Room planning · Setup · Ongoing support</p>
        </div>
        <figure className="web-panel web-kiosk-figure">
          <AngularFrame />
          <div className="web-kiosk-photo">
            <Image
              src={websiteContent.images.kiosk}
              alt="An installed Zoom Rooms touchscreen kiosk with controls to start a meeting, join, and share content"
              fill
              sizes="(min-width: 1440px) 620px, (min-width: 801px) 47vw, 90vw"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <figcaption>
            <span className="web-kiosk-status">
              <span aria-hidden="true" />
              In production
            </span>
            <span>One of my Zoom Rooms kiosks, installed and in use.</span>
          </figcaption>
        </figure>
      </section>
      <section
        className="web-container web-hybrid-services web-section"
        aria-labelledby="meeting-services-title"
      >
        <div className="web-hybrid-services-heading">
          <p className="web-eyebrow">A room that works for everyone</p>
          <h2 id="meeting-services-title" className="web-heading">
            Every seat.
            <br />
            <span className="web-gold">In the conversation.</span>
          </h2>
          <p className="web-copy">
            Good meeting technology should make it easier to talk, listen, and share. I help connect
            the details so your team can focus on the meeting.
          </p>
        </div>
        <ul className="web-meeting-services-list">
          {meetingServices.map((service) => (
            <li key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="web-container web-hybrid-pricing" aria-labelledby="meeting-pricing-title">
        <AngularFrame className="web-hybrid-pricing-frame" />
        <div className="web-hybrid-pricing-heading">
          <p className="web-eyebrow">Clear scope. Personal support.</p>
          <h2 id="meeting-pricing-title">From setup to everyday use.</h2>
        </div>
        <div className="web-pricing-grid">
          <div>
            <p className="web-eyebrow">Room setup</p>
            <p className="web-price">
              ${offer.setupPrice.toLocaleString('en-US')}
              <span>one-time</span>
            </p>
            <p className="web-pricing-description">{offer.setupDescription}</p>
          </div>
          <div>
            <p className="web-eyebrow">Device management</p>
            <p className="web-price">
              ${offer.monthlyPrice}
              <span>/month</span>
            </p>
            <p className="web-pricing-description">{offer.managementDescription}</p>
          </div>
        </div>
        <Separator />
        <p className="web-pricing-note">{offer.qualification}</p>
      </section>
      <section className="web-container web-hybrid-planning web-section">
        <div>
          <p className="web-eyebrow">Start with the space</p>
          <h2 className="web-heading">
            Plan the room.
            <br />
            Then choose the hardware.
          </h2>
        </div>
        <div>
          <p className="web-copy">
            A meeting room, boardroom, community space, or studio can have very different needs.
            We’ll work through the setup before equipment choices become expensive guesswork.
          </p>
          <ul className="web-profile-checklist">
            {[
              'How many people use the room, in person and remotely?',
              'What needs to be heard, seen, and shared?',
              'What equipment do you have, and what needs to change?',
              'Who will run the system and keep it current?',
            ].map((item) => (
              <li key={item}>
                <Check aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <PageCallToAction
        title={
          <>
            Your next meeting.
            <br />
            <span className="web-gold">A better experience.</span>
          </>
        }
        description="Tell me about your room and the way your team meets. We’ll find a practical setup and a clear plan for getting it running."
        label="Let’s talk about your room"
        href={inquiryHref}
      />
    </PageFrame>
  )
}
