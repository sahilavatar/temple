export interface TempleFeatureLore {
  id: string;
  title: string;
  traditionalTerm: string;
  category: 'architecture' | 'artifact' | 'ritual';
  summary: string;
  details: string[];
  mantra?: string;
}

export const TEMPLE_LORE: Record<string, TempleFeatureLore> = {
  garbhagriha: {
    id: 'garbhagriha',
    title: 'Sanctum Sanctorum',
    traditionalTerm: 'Garbhagriha (Sacred Womb Chamber)',
    category: 'architecture',
    summary: 'The most sacred inner sanctum where the presiding deity dwells in pure stillness and concentrated spiritual energy.',
    details: [
      'In classical Vastu architecture, this inner chamber represents the Brahmasthana—the absolute center point of cosmic balance.',
      'Unlike the sunlit outdoor Mandapa, the sanctum maintains serene focus, quiet reverence, and fragrant sandalwood-scented air.',
      'The sculpted murti is installed directly beneath the apex of the towering mountain spire, forming a direct axis connecting earth to the heavens.'
    ],
    mantra: 'Om, salutations and adoration unto Lord Hanuman, embodiment of courage and divine strength.'
  },
  mandapa: {
    id: 'mandapa',
    title: 'Pillared Assembly Hall',
    traditionalTerm: 'Mandapa (Hypostyle Hall)',
    category: 'architecture',
    summary: 'The grand assembly hall supported by intricately sculpted sandstone pillars, where devotees gather for meditation and prayer.',
    details: [
      'The faceted stone columns feature lotus bases, carved floral shafts, and blooming bracket capitals symbolizing spiritual enlightenment.',
      'The corbelled stone ceiling features stepped concentric rings leading to a carved central lotus medallion.',
      'Ancient temple acoustics naturally reflect chanting, hymns, and prayer vibrations throughout the mountain summit.'
    ]
  },
  shikhara: {
    id: 'shikhara',
    title: 'Towering Mountain Spire',
    traditionalTerm: 'Shikhara (Nagara Mountain Spire)',
    category: 'architecture',
    summary: 'The majestic tiered mountain-spire rising above the sanctum sanctorum, symbolizing Mount Meru—the cosmic axis of the universe.',
    details: [
      'Constructed in the classical Nagara temple tradition with stepped tiers of interlocking stone blocks.',
      'Crowned at the summit by the ribbed Amalaka stone cogwheel and the golden Kalasha finial.',
      'The fluttering saffron flag at the peak signifies divine victory, protection, and eternal devotion.'
    ]
  },
  bell: {
    id: 'bell',
    title: 'Sacred Temple Bell',
    traditionalTerm: 'Ghanta (Sacred Bronze Bell)',
    category: 'artifact',
    summary: 'Crafted from five traditional sacred metals, the temple bell produces a clear, long-sustaining chime that centers the devotee\'s mind.',
    details: [
      'Touching and ringing the bell announces one\'s respectful arrival before entering the sacred sanctuary.',
      'The resonance harmonizes the atmosphere and brings the mind into immediate present-moment awareness.',
      'The body of the bell traditionally signifies eternity, while the internal clapper represents wisdom.'
    ],
    mantra: 'May divine energies awaken and all disharmony depart at the sacred chime of the temple bell.'
  },
  gada: {
    id: 'gada',
    title: 'Divine Mace of Lord Hanuman',
    traditionalTerm: 'Gada (Sacred Mace of Sovereign Strength)',
    category: 'artifact',
    summary: 'The iconic golden mace held by Lord Hanuman, representing supreme moral sovereignty, fearlessness, and victory over inner ego.',
    details: [
      'Rather than a weapon of conflict, Hanuman\'s mace symbolizes unwavering spiritual focus and the mastery of the mind.',
      'Resting peacefully on the altar floor, it reminds us that genuine strength is always rooted in humility and righteousness.',
      'Artfully rendered in gleaming golden brass with fluted lotus petals and ornamental engravings.'
    ],
    mantra: 'Swift as the mind and mighty as the wind, master of the senses and foremost among the wise.'
  },
  diya: {
    id: 'diya',
    title: 'Sacred Diya Lamp',
    traditionalTerm: 'Deepa (Oil Diya Lamp)',
    category: 'ritual',
    summary: 'Traditional brass and clay oil lamp, symbolizing the triumph of spiritual illumination over darkness and doubt.',
    details: [
      'The earthen body represents our physical form, the oil represents thoughts and attachments, and the wick symbolizes ego.',
      'When illuminated by the flame of divine awareness, ignorance dissolves completely into radiant clarity.',
      'The upward-pointing flame inspires the devotee to always keep heart and mind directed toward truth.'
    ],
    mantra: 'Lead us from untruth to truth, from darkness unto light, and from mortality unto immortality.'
  },
  pushpanjali: {
    id: 'pushpanjali',
    title: 'Flower Offering (Pushpanjali)',
    traditionalTerm: 'Pushpanjali (Devotional Offering of Blossoms)',
    category: 'ritual',
    summary: 'The devotional offering of fresh fragrant marigold and rose petals at the lotus feet of Lord Hanuman.',
    details: [
      'Golden-orange marigolds symbolize devotion, warmth, selfless service, and auspicious beginnings.',
      'Offering fresh petals expresses the opening of one\'s heart like a blossom toward divine grace.',
      'Devotees shower petals as a gesture of gratitude, reverence, and unconditional surrender.'
    ]
  },
  aarti: {
    id: 'aarti',
    title: 'Sacred Aarti Offering',
    traditionalTerm: 'Aarti (Wave of Sacred Camphor Flame)',
    category: 'ritual',
    summary: 'The sacred ritual of waving a lit flame in graceful circles before the deity to receive blessings and illumination.',
    details: [
      'Moving the lamp in clockwise circles traces the cosmic wheel, honoring the divine center of existence.',
      'Pure camphor burns completely without leaving residue, reminding us to dissolve our limitations into light.',
      'Devotees gently draw the warmth of the flame toward their eyes and brow to welcome inner peace.'
    ],
    mantra: 'Pure as white camphor, the ocean of compassion, essence of the world, we honor you in our hearts.'
  },
  sindoor: {
    id: 'sindoor',
    title: 'Auspicious Saffron Vermillion',
    traditionalTerm: 'Sindoor (Sacred Vermillion Coating)',
    category: 'ritual',
    summary: 'The radiant saffron-vermillion hue gracing Lord Hanuman\'s murti, embodying boundless love and loyalty.',
    details: [
      'When Hanuman learned that Mother Sita wore a red mark for Lord Rama\'s longevity, he lovingly anointed his entire form with vermillion.',
      'Moved by his childlike, unconditional devotion, Lord Rama granted that all who honor Hanuman in this hue are protected from adversity.',
      'The vibrant orange color reflects the warm sunrise, courage, joy, and deep spiritual determination.'
    ]
  }
};
