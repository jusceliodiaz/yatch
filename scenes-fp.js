const CONFIG = {
  timeline: [
    {
      id: "aerial",
      label: "Pool",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"/><path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3 2 4.5 0 3 2 4.5 0"/><path d="M7 5v4M17 5v4M12 3v6"/></svg>',
    },
    {
      id: "aerial2",
      label: "Pool 2",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"/><path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3 2 4.5 0 3 2 4.5 0"/><path d="M7 5v4M17 5v4M12 3v6"/></svg>',
    },
  ],
  scenes: {
    aerial: {
      // Video 2, forward + reversed in one file so the native loop is seamless.
      // No day/night yet: the 1_night* clips belong to video 1's shot.
      video: "images/2_pingpong.webm?v=1",
      pois: [],
    },
    // Video 1 (forward + reverse) with its day/night clips.
    aerial2: {
      video: "images/1_pingpong.webm?v=1",
      pois: [],
      abVideoB: "images/1_night.webm?v=4",
      abVideoBReverse: "images/1_night_rev.webm?v=3",
      abVideoBLoop: "images/1_night_loop.webm?v=3",
    },
  },
  sequences: {
    "aerial-ab-reveal": {
      folder: "images/seq_arch/",
      prefix: "pool2_to_night_",
      from: 0,
      to: 59,
      v: 3,
      pad: 2,
      ext: "jpg",
    },
  },
  transitions: {},
};
