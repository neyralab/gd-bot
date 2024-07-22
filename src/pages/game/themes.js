export const levelSubThemes = [
  {
    level: 1,
    colors: {
      buttonText: '#6bb1ff',
      experienceBar: {
        active: {
          background1: '#4facfe',
          background2: '#00f2fe',
          boxShadow: '#2379f9'
        },
        empty: {
          background1: [79, 172, 254],
          background2: [0, 242, 254],
          boxShadow: '#2379f9'
        }
      },

      shipBase: '#FFFFFF',
      wing: '#FFFFFF',
      wingAccent: '#FFFFFF',
      emission: '#AEE0FF',
      fog: '#A3C5E7',
      wave: '#4495E7',
      directionalLight: '#B0C8FA',
      accentEmission: '#1177C0',
      shipTrailEmission: '#3EC2FF'
    },

    glareImg: 'glare-color-hawk-1.png'
  },

  {
    level: 2,
    colors: {
      buttonText: '#FFAB6B',
      experienceBar: {
        active: {
          background1: '#FFA500',
          background2: '#FE6B00',
          boxShadow: '#FFA500'
        },
        empty: {
          background1: [255, 165, 0],
          background2: [255, 165, 0],
          boxShadow: '#FFA500'
        }
      },

      shipBase: '#FFFFFF',
      wing: '#FFFFFF',
      wingAccent: '#FFFFFF',
      emission: '#FFE3AE',
      fog: '#E79191',
      wave: '#E7AE44',
      directionalLight: '#CAE199',
      accentEmission: '#DC4F29',
      shipTrailEmission: '#FFBB3E'
    },

    glareImg: 'glare-color-hawk-2.png'
  },

  {
    level: 3,
    colors: {
      buttonText: '#AE66F5',
      experienceBar: {
        active: {
          background1: '#8011EF',
          background2: '#AE66F5',
          boxShadow: '#8011EF'
        },
        empty: {
          background1: [169, 79, 254],
          background2: [122, 79, 254],
          boxShadow: '#8011EF'
        }
      },

      shipBase: '#FFFFFF',
      wing: '#FFFFFF',
      wingAccent: '#FFFFFF',
      emission: '#D6AEFF',
      fog: '#A3B1E7',
      wave: '#9544E7',
      directionalLight: '#A3B1E7',
      accentEmission: '#8F49D5',
      shipTrailEmission: '#9E3EFF'
    },

    glareImg: 'glare-color-hawk-3.png'
  },

  {
    level: 4,
    colors: {
      buttonText: '#9FFF6B',
      experienceBar: {
        active: {
          background1: '#97FF87',
          background2: '#8DFDAC',
          boxShadow: '#97FF87'
        },
        empty: {
          background1: [151, 255, 135],
          background2: [1, 216, 7],
          boxShadow: '#97FF87'
        }
      },

      shipBase: '#FFFFFF',
      wing: '#FFFFFF',
      wingAccent: '#FFFFFF',
      emission: '#B9FFAE',
      fog: '#93D0BE',
      wave: '#5AE744',
      directionalLight: '#A3E7BF',
      accentEmission: '#29C011',
      shipTrailEmission: '#58FF3E'
    },

    glareImg: 'glare-color-hawk-4.png'
  },

  {
    level: 5,
    colors: {
      buttonText: '#F57070',
      experienceBar: {
        active: {
          background1: '#FF0000',
          background2: '#F57070',
          boxShadow: '#FF0000'
        },
        empty: {
          background1: [255, 0, 0],
          background2: [237, 108, 108],
          boxShadow: '#FF0000'
        }
      },

      shipBase: '#FFFFFF',
      wing: '#FFFFFF',
      wingAccent: '#FFFFFF',
      emission: '#FFAEAE',
      fog: '#DDA3E7',
      wave: '#E74444',
      directionalLight: '#E7C8A3',
      accentEmission: '#C01111',
      shipTrailEmission: '#FF3E3E'
    },

    glareImg: 'glare-color-hawk-5.png'
  },

  {
    level: 6,
    colors: {
      buttonText: '#EE82EE',
      experienceBar: {
        active: {
          background1: '#EE82EE',
          background2: '#F9CEF9',
          boxShadow: '#EE82EE'
        },
        empty: {
          background1: [238, 130, 238],
          background2: [238, 130, 238],
          boxShadow: '#EE82EE'
        }
      },

      shipBase: '#FFFFFF',
      wing: '#FFFFFF',
      wingAccent: '#FFFFFF',
      emission: '#FFAEFF',
      fog: '#A3B9E7',
      wave: '#E744E7',
      directionalLight: '#B3A3E7',
      accentEmission: '#C011C0',
      shipTrailEmission: '#FF3EFF'
    },

    glareImg: 'glare-color-hawk-6.png'
  },

  {
    level: 7,
    colors: {
      buttonText: '#534FFE',
      experienceBar: {
        active: {
          background1: '#534FFE',
          background2: '#0066FE',
          boxShadow: '#2379F9'
        },
        empty: {
          background1: [79, 107, 254],
          background2: [0, 132, 254],
          boxShadow: '#2379F9'
        }
      },

      shipBase: '#FFFFFF',
      wing: '#FFFFFF',
      wingAccent: '#FFFFFF',
      emission: '#C8C7FF',
      fog: '#A3D3E7',
      wave: '#4744E7',
      directionalLight: '#A3BFE7',
      accentEmission: '#5F5DF6',
      shipTrailEmission: '#6360FF'
    },

    glareImg: 'glare-color-hawk-7.png'
  }
];

export const themes = [
  {
    id: 'hawk',
    name: 'Hawk',
    multiplier: 1,
    cost: 0,
    data: '0.01MB'
    /** Apply one of subthemes here. */
  },
  {
    id: 'gold',
    name: 'Gold',
    multiplier: 10,
    cost: 0,
    data: '0.10MB',
    colors: {
      buttonText: '#FFAB6B',
      experienceBar: {
        active: {
          background1: '#FFA500',
          background2: '#FE6B00',
          boxShadow: '#FFA500'
        },
        empty: {
          background1: [255, 165, 0],
          background2: [255, 165, 0],
          boxShadow: '#FFA500'
        }
      },

      shipBase: '#F4CA16',
      wing: '#F4CA16',
      wingAccent: '#F4CA16',
      emission: '#FFE3AE',
      fog: '#E79191',
      wave: '#E7AE44',
      directionalLight: '#CAE199',
      accentEmission: '#DC4F29',
      shipTrailEmission: '#FFBB3E'
    },

    glareImg: 'glare-color-hawk-2.png'
  },
  {
    id: 'ghost',
    name: 'Ghost',
    multiplier: 25,
    cost: 0.25,
    data: '0.25MB',
    colors: {
      buttonText: '#6bffa6',
      experienceBar: {
        active: {
          background1: '#3cd309',
          background2: '#88c839',
          boxShadow: '#3cd309'
        },
        empty: {
          background1: [236, 254, 79],
          background2: [254, 186, 0],
          boxShadow: '#3cd309'
        }
      },

      shipBase: '#000000',
      wing: '#000000',
      wingAccent: '#000000',
      emission: '#8EE339',
      fog: '#A3E7BF',
      wave: '#44E780',
      directionalLight: '#A3E7BF',
      accentEmission: '#B53EFF',
      shipTrailEmission: '#8EE339'
    },

    glareImg: 'glare-color-ghost.png'
  }
];
