import type { Metadata } from 'next';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { Intro } from '@/components/motion/Intro';
import { SecHead } from '@/components/ui/SecHead';
import { doctors } from '@/content/doctors';
import { facilities } from '@/content/care';
import { pages } from '@/content/routes';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';
import { AboutIntro } from '@/sections/home/AboutIntro';
import { DepartmentsRail } from '@/sections/home/DepartmentsRail';
import { DoctorsFilter } from '@/sections/home/DoctorsFilter';
import { FacilitiesShow } from '@/sections/home/FacilitiesShow';
import { MomentsHero } from '@/sections/home/MomentsHero';
import { Trust } from '@/sections/home/Trust';
import { Count } from '@/components/motion/Count';
import { EmergencyBand } from '@/sections/shared/EmergencyBand';
import { LibraryBlock } from '@/sections/shared/LibraryBlock';
import { StoriesBlock } from '@/sections/shared/StoriesBlock';
import { VisitBlock } from '@/sections/shared/VisitBlock';

export const metadata: Metadata = pageMetadata(pages.home);

const featured = ['meera-k', 'rahul-v', 'leena-r', 'vivek-p'].map((slug) =>
  doctors.find((d) => d.slug === slug)!,
);

export default function HomePage() {
  return (
    <>
      <Intro />
      <MomentsHero />
      <Trust />
      <AboutIntro />

      <section id="departments" className="section" aria-labelledby="dept-title">
        <div className="wrap">
          <SecHead
            id="dept-title"
            title="Departments and treatments"
            intro={`Thirty-two departments under one roof, each with its own specialists, diagnostics and nurses. Your records follow you between them.`}
            link={{ href: '/departments', label: `All ${site.facts.departments} departments` }}
          />
        </div>
        <DepartmentsRail />
      </section>

      <EmergencyBand />

      <section id="doctors" className="section wrap" aria-labelledby="doc-title">
        <SecHead
          id="doc-title"
          title="Our doctors"
          intro={`${site.facts.doctors} specialists. See who is available today and book directly with the doctor you choose.`}
          link={{ href: '/doctors', label: 'Find a doctor' }}
        />
        <DoctorsFilter
          total={featured.length}
          filters={[
            { value: 'all', label: 'All departments' },
            { value: 'cardiology', label: 'Cardiology' },
            { value: 'obstetrics-and-gynaecology', label: 'Obstetrics and Gynaecology' },
            { value: 'orthopaedics', label: 'Orthopaedics' },
          ]}
        >
          {featured.map((d) => (
            <DoctorCard key={d.slug} doctor={d} />
          ))}
        </DoctorsFilter>
      </section>

      <section id="facilities" className="section wrap" aria-labelledby="fac-title">
        <SecHead
          id="fac-title"
          title="Inside the hospital"
          intro="Emergency, intensive care, surgery, imaging and a 24-hour laboratory, all in one building, so your care never waits on a transfer."
          link={{ href: '/facilities', label: 'All facilities' }}
        />
        <FacilitiesShow />
        <ul className="g12 fac-list" data-rise>
          <li>
            <b>
              <Count to={String(site.facts.theatres)} />
            </b>
            <span>operation theatres</span>
          </li>
          <li>
            <b>
              <Count to={String(site.facts.icuBeds)} />
            </b>
            <span>intensive care beds</span>
          </li>
          <li>
            <b>3T MRI</b>
            <span>and 128-slice CT</span>
          </li>
          <li>
            <b>24 h</b>
            <span>pharmacy and laboratory</span>
          </li>
        </ul>
        <p className="sr">{facilities.map((f) => f.name).join(', ')}</p>
      </section>

      <StoriesBlock />
      <LibraryBlock />
      <VisitBlock />
    </>
  );
}
