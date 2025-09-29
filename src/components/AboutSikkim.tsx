import React from 'react';

const AboutSikkim: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-12 md:py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-monastery-gold mb-4">Districts of Sikkim</h1>
            <p className="text-slate-200 leading-relaxed mb-6">
              Sikkim has six districts namely Gangtok, Mangan, Namchi, Gyalshing, Pakyong and Soreng. The district capitals are also Gangtok, Mangan, Namchi, Gyalshing, Pakyong and Soreng respectively. These six districts are further divided into 16 subdivisions. Pakyong and Soreng Districts were added after December 2021.
            </p>
            <img src="/src/assets/area/district_sikkim.jpg" alt="Districts of Sikkim" className="rounded-xl shadow-lg w-full mb-8" />
          </div>

          <div>
            <img src="/src/assets/area/information_sikkim.jpg" alt="Sikkim Information" className="rounded-xl shadow-lg w-full mb-6" />
            <div className="space-y-6 text-slate-200">
              <section>
                <h2 className="text-2xl font-bold text-monastery-gold mb-2">Gangtok</h2>
                <p>
                  Earlier known as East District, it is the most populated and also the main administrative and business centre. Apart from the modern attractions of the capital town, in the east you will also find the beautiful Tsomgo Lake, the historically important Nathula pass, as well as many monasteries and temples. Gangtok is the capital of Sikkim and heart of all the business hubs.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-monastery-gold mb-2">Mangan</h2>
                <p>
                  Earlier known as North District, it is the most beautiful and the largest of all the districts in Sikkim. North offers an exquisite experience for the lover of Nature and alpine scenery. Yumthang alone is enough to satiate the most demanding, with its panoramic Valley of Flowers. During springtime the lush meadows abound with delicate wildflowers that carpet the Valley floor in a rich riot of colors. A must-see here are the Hot Springs and the vibrant Sikkimese tribal culture and customs. 67 kms from Gangtok is the Mangan District Headquarter of North District. A three-day music festival is held at Mangan in December every year.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-monastery-gold mb-2">Gyalshing</h2>
                <p>
                  Gyalshing earlier known as West Sikkim is replete with history and religion. This is where the first Chogyal of Sikkim was consecrated at Yuksum in 1642 and this is where some of the holiest and most important monasteries of Sikkim were established, including Dubdi and Sanga Choling, the first monasteries to be built in Sikkim. West Sikkim is beautiful terrain abounding in lakes and waterfalls and has great trekking routes. Gyalshing is the head quarter and town of the West District.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-monastery-gold mb-2">Namchi</h2>
                <p>
                  Earlier known as South Sikkim, Namchi is has variety of tourist attractions. With stupendous view of the Khangchendzonga range, the south of Sikkim is a fairy tale land of picturesque villages and high hills. Near Namchi, the district headquarters is Samdruptse Hill, the site of the 135 feet tall statue of Guru Padmasambhava. In the south too are Tendong Hill and Maenam Hill, of mythical importance to the Lepchas and Bhutias, as well as the tourist destination of Ravangla which hosts the annual Pang Lhabsol festival with great pageantry. Namchi is the district headquarter of South Sikkim which is 78 kms from Gangtok.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-monastery-gold mb-2">Pakyong</h2>
                <p>
                  Pakyong, declared as a district in Sikkim in December 2021. With many scenic beauty, it also has only airport "Greenfield Airport" of Sikkim, the upcoming Majhitar Railway Station, and four National Highways including NH-10, NH-717A, NH-717B, and Rolep-Menla National Highway. Pakyong bagged the 8th best district among 75 districts of India which were selected for the ‘Azadi Se Antyodaya Tak (ASAT)’ 90-day inter-ministerial campaign.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-monastery-gold mb-2">Soreng</h2>
                <p>
                  Soreng is the second new district in the state of Sikkim. Covering an area of 293.22 square kilometres, the Soreng district is officially the smallest Sikkim district. Some of the oldest monasteries, great scenic beauty, agricultural society and peace & tranquility is the identity of Soreng District. Rinchenpung Monastery in Rinchenpong and Sri Badam Phuntshog Ngayabling Monastery in Sri Badam are among the oldest monasteries of Soreng. Other important places are Rinchenpong, Kaluk, Sabgadorjee.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSikkim;
