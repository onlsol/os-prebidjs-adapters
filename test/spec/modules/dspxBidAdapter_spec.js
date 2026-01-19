import { expect } from 'chai';
import { config } from 'src/config.js';
import { spec } from 'modules/dspxBidAdapter.js';
import { newBidder } from 'src/adapters/bidderFactory.js';
import { deepClone } from '../../../src/utils.js';
import {BANNER} from '../../../src/mediaTypes.js';

const ENDPOINT_URL = 'https://buyer.dspx.tv/request/';
const ENDPOINT_URL_DEV = 'https://dcbuyer.dspx.tv/request/';

function normalizeRequestData(data) {
  return data.replace(/rnd=\d+\&/g, '').replace(/ref=.*\&bid/g, 'bid').replace(/pbver=.*?&/g, 'pbver=test&');
}

const TEST_FIXTURES = {
  bidderRequest: {
    refererInfo: {
      referer: 'some_referrer.net'
    },
    gdprConsent: {
      consentString: 'BOJ/P2HOJ/P2HABABMAAAAAZ+A==',
      vendorData: {someData: 'value'},
      gdprApplies: true
    }
  },
  
  bidderRequestWithoutGdpr: {
    refererInfo: {
      referer: 'some_referrer.net'
    }
  }
};

describe('dspxAdapter', function () {
  const adapter = newBidder(spec);

  describe('isBidRequestValid', function () {
    const bid = {
      'bidder': 'dspx',
      'params': {
        'placement': '6682',
        'pfilter': {
          'floorprice': 1000000
        },
        'bcat': 'IAB2,IAB4',
        'dvt': 'desktop'
      },
      'sizes': [
        [300, 250]
      ],
      'bidId': '30b31c1838de1e',
      'bidderRequestId': '22edbae2733bf6',
      'auctionId': '1d1a030790a475'
    };

    it('should return true when required params found', function () {
      expect(spec.isBidRequestValid(bid)).to.equal(true);
    });

    it('should return false when required params are not passed', function () {
      const invalidBid = {
        bidId: '30b31c1838de1e',
        bidder: 'dspx',
        mediaTypes: {
          [BANNER]: {
            sizes: [[300, 250]]
          }
        },
        params: {
          someIncorrectParam: 0
        }
      }
      expect(spec.isBidRequestValid(invalidBid)).to.equal(false);
    });
  });

  describe('buildRequests', function () {
    let bidderRequest;
    let bidderRequestWithoutGdpr;
    let bidderRequestWithORTB;

    beforeEach(function () {
      bidderRequest = deepClone(TEST_FIXTURES.bidderRequest);
      bidderRequestWithoutGdpr = deepClone(TEST_FIXTURES.bidderRequestWithoutGdpr);
    });

    const bidRequests = [{
      'bidder': 'dspx',
      'params': {
        'placement': '6682',
        'pfilter': {
          'floorprice': 1000000,
          'private_auction': 0,
          'geo': {
            'country': 'DE'
          }
        },
        'bcat': 'IAB2,IAB4',
        'dvt': 'desktop'
      },
      'sizes': [
        [300, 250]
      ],
      'bidId': '30b31c1838de1e1',
      'bidderRequestId': '22edbae2733bf61',
      'auctionId': '1d1a030790a475',
      'adUnitCode': 'testDiv1',

      'userIdAsEids': [{
        'source': 'criteo.com',
        'uids': [{
          'id': 'criteo',
          'atype': 1
        }]
      }, {
        'source': 'pubcid.org',
        'uids': [{
          'id': 'pubcid',
          'atype': 1
        }]
      },
      {
        'source': 'netid.de',
        'uids': [{
          'id': 'netid',
          'atype': 1
        }]
      },
      {
        'source': 'uidapi.com',
        'uids': [{
          'id': 'uidapi',
          'atype': 1
        }]
      },
      {
        'source': 'sharedid.org',
        'uids': [{
          'id': 'sharedid',
          'atype': 1
        }]
      },
      {
        'source': 'adserver.org',
        'uids': [{
          'id': 'adserver',
          'atype': 1
        }]
      },
      {
        'source': 'pubmatic.com',
        'uids': [{
          'id': 'pubmatic',
          'atype': 1
        }]
      },
      {
        'source': 'yahoo.com',
        'uids': [{
          'id': 'yahoo',
          'atype': 1
        }]
      },
      {
        'source': 'utiq.com',
        'uids': [{
          'id': 'utiq',
          'atype': 1
        }]
      },
      {
        'source': 'euid.eu',
        'uids': [{
          'id': 'euid',
          'atype': 1
        }]
      },
      {
        'source': 'id5-sync.com',
        'uids': [
          {
            'id': 'ID5UID',
            'atype': 1,
            'ext': {
              'linkType': 2
            }
          }
        ]
      }, {
        source: "domain.com",
        uids: [{
          id: "1234",
          atype: 1,
          ext: {
            stype: "ppuid"
          }

        }]
      }
      ],
      'crumbs': {
        'pubcid': 'crumbs_pubcid'
      },
      'ortb2': {
        'source': {
          'ext': {
            'schain': {
              'ver': '1.0',
              'complete': 1,
              'nodes': [
                {
                  'asi': 'example.com',
                  'sid': '0',
                  'hp': 1,
                  'rid': 'bidrequestid',
                  'domain': 'example.com'
                }
              ]
            }
          }
        }
      }
    },
    { // 1
      'bidder': 'dspx',
      'params': {
        'placement': '101',
        'devMode': true
      },
      'sizes': [
        [300, 250]
      ],
      'bidId': '30b31c1838de1e2',
      'bidderRequestId': '22edbae2733bf62',
      'auctionId': '1d1a030790a476'
    }, { // 2
      'bidder': 'dspx',
      'params': {
        'placement': '6682',
        'pfilter': {
          'floorprice': 1000000,
          'private_auction': 0,
          'geo': {
            'country': 'DE'
          }
        },
        'bcat': 'IAB2,IAB4',
        'dvt': 'desktop'
      },
      'sizes': [
        [300, 250]
      ],
      'bidId': '30b31c1838de1e3',
      'bidderRequestId': '22edbae2733bf69',
      'auctionId': '1d1a030790a477',
      'adUnitCode': 'testDiv2'
    },
    { // 3
      'bidder': 'dspx',
      'params': {
        'placement': '101',
        'devMode': true
      },
      'mediaTypes': {
        'video': {
          'playerSize': [640, 480],
          'context': 'instream',
          'protocols': [1, 2],
          'playbackmethod': [2],
          'skip': 1
        },
        'banner': {
          'sizes': [
            [300, 250]
          ]
        }
      },

      'bidId': '30b31c1838de1e4',
      'bidderRequestId': '22edbae2733bf67',
      'auctionId': '1d1a030790a478',
      'adUnitCode': 'testDiv3'
    },
    { // 4
      'bidder': 'dspx',
      'params': {
        'placement': '101',
        'devMode': true,
        'vastFormat': 'vast4'
      },
      'mediaTypes': {
        'video': {
          'playerSize': [640, 480],
          'context': 'instream',
          'protocols': [1, 2],
          'playbackmethod': [2],
          'skip': 1,
          'renderer': {
            url: 'example.com/videoRenderer.js',
            render: function (bid) { alert('test'); }
          }
        }
      },
      'bidId': '30b31c1838de1e41',
      'bidderRequestId': '22edbae2733bf67',
      'auctionId': '1d1a030790a478',
      'adUnitCode': 'testDiv4'
    },
    { // 5
      'bidder': 'dspx',
      'params': {
        'placement': '101',
        'devMode': true,
        'dev': {
          'endpoint': 'http://localhost',
          'placement': '107',
          'pfilter': {'test': 1}
        }
      },
      'mediaTypes': {
        'video': {
          'playerSize': [640, 480],
          'context': 'instream',
          'mimes': ['video/mp4'],
          'protocols': [1, 2],
          'playbackmethod': [2],
          'skip': 1
        },
        'banner': {
          'sizes': [
            [300, 250]
          ]
        }
      },

      'bidId': '30b31c1838de1e4',
      'bidderRequestId': '22edbae2733bf67',
      'auctionId': '1d1a030790a478',
      'adUnitCode': 'testDiv3'
    },

    ];

    beforeEach(function () {
      bidderRequestWithORTB = {
        refererInfo: {
          referer: 'some_referrer.net'
        },
        gdprConsent: {
          consentString: 'BOJ/P2HOJ/P2HABABMAAAAAZ+A==',
          vendorData: {someData: 'value'},
          gdprApplies: true
        },
        ortb2: {
          source: {},
          site: {
            domain: 'buyer',
            publisher: {
              domain: 'buyer'
            },
            page: 'http://buyer/schain.php?ver=8.5.0-pre:latest-dev-build&pbjs_debug=true',
            pagecat: ['IAB3'],
            ref: 'http://buyer/pbjsv/',
            content: {
              id: 'contentID',
              episode: 1,
              title: 'contentTitle',
              series: 'contentSeries',
              season: 'contentSeason 3',
              artist: 'contentArtist',
              genre: 'rock',
              isrc: 'contentIsrc',
              url: 'https://content-url.com/',
              context: 1,
              keywords: 'kw1,kw2,keqword 3',
              livestream: 0,
              cat: [
                'IAB1-1',
                'IAB1-2',
                'IAB2-10'
              ]
            }
          },
          bcat: ['BSW1', 'BSW2'],
        }
      };
    });

    describe('Endpoint selection', function () {
      it('should send GET request to production endpoint by default', function () {
        const request = spec.buildRequests([bidRequests[0]], bidderRequest)[0];
        expect(request.method).to.equal('GET');
        expect(request.url).to.equal(ENDPOINT_URL);
      });

      it('should send GET request to dev endpoint when devMode is enabled', function () {
        const request = spec.buildRequests([bidRequests[1]], bidderRequest)[0];
        expect(request.method).to.equal('GET');
        expect(request.url).to.equal(ENDPOINT_URL_DEV);
      });

      it('should use custom endpoint from dev config when provided', function () {
        const request = spec.buildRequests([bidRequests[5]], bidderRequestWithoutGdpr)[0];
        expect(request.url).to.equal('http://localhost');
      });
    });

    describe('Request parameters', function () {
      it('should include all required parameters with GDPR consent', function () {
        const request = spec.buildRequests([bidRequests[0]], bidderRequest)[0];
        const data = normalizeRequestData(request.data);
        expect(data).to.contain('_f=auto');
        expect(data).to.contain('alternative=prebid_js');
        expect(data).to.contain('inventory_item_id=6682');
        expect(data).to.contain('srw=300');
        expect(data).to.contain('srh=250');
        expect(data).to.contain('vpw=');
        expect(data).to.contain('vph=');
        expect(data).to.contain('bid_id=30b31c1838de1e1');
        expect(data).to.contain('pfilter%5Bfloorprice%5D=1000000');
        expect(data).to.contain('pfilter%5Bgdpr_consent%5D=BOJ%2FP2HOJ%2FP2HABABMAAAAAZ%2BA%3D%3D');
        expect(data).to.contain('pfilter%5Bgdpr%5D=true');
        expect(data).to.contain('bcat=IAB2%2CIAB4');
        expect(data).to.contain('auctionId=1d1a030790a475');
        expect(data).to.contain('schain=1.0%2C1!example.com');
        expect(data).to.contain('did_cruid=criteo');
        expect(data).to.contain('did_pubcid=pubcid');
      });
    });

    describe('GDPR handling', function () {
      it('should include GDPR consent parameters when provided', function () {
        const request = spec.buildRequests([bidRequests[1]], bidderRequest)[0];
        const data = normalizeRequestData(request.data);
        expect(data).to.contain('pfilter%5Bgdpr_consent%5D=BOJ%2FP2HOJ%2FP2HABABMAAAAAZ%2BA%3D%3D');
        expect(data).to.contain('pfilter%5Bgdpr%5D=true');
      });

      it('should build request without GDPR when consent is not provided', function () {
        const request = spec.buildRequests([bidRequests[2]], bidderRequestWithoutGdpr)[0];
        const data = normalizeRequestData(request.data);
        expect(data).to.not.contain('gdpr_consent');
        expect(data).to.contain('inventory_item_id=6682');
        expect(data).to.contain('srw=300');
        expect(data).to.contain('srh=250');
        expect(data).to.contain('vpw=');
        expect(data).to.contain('vph=');
        expect(data).to.contain('bid_id=30b31c1838de1e3');
        expect(data).to.contain('pfilter%5Bfloorprice%5D=1000000');
        expect(data).to.contain('bcat=IAB2%2CIAB4');
        expect(data).to.contain('auctionId=1d1a030790a477');
      });
    });

    describe('Media types', function () {
      it('should handle mixed video and banner media types', function () {
        const request = spec.buildRequests([bidRequests[3]], bidderRequestWithoutGdpr)[0];
        const data = normalizeRequestData(request.data);
        expect(data).to.contain('media_types%5Bvideo%5D=640x480');
        expect(data).to.contain('media_types%5Bbanner%5D=300x250');
        expect(data).to.contain('vctx=instream');
      });

      it('should include video-specific parameters for video requests', function () {
        const request = spec.buildRequests([bidRequests[4]], bidderRequestWithoutGdpr)[0];
        const data = normalizeRequestData(request.data);
        expect(data).to.contain('media_types%5Bvideo%5D=640x480');
        expect(data).to.contain('vctx=instream');
        expect(data).to.contain('vf=vast4');
        expect(data).to.contain('vpl%5Bprotocols%5D');
      });
    });

    describe('Dev mode configuration', function () {
      it('should override endpoint and placement with dev config', function () {
        const request = spec.buildRequests([bidRequests[5]], bidderRequestWithoutGdpr)[0];
        expect(request.url).to.equal('http://localhost');
        const data = normalizeRequestData(request.data);
        expect(data).to.contain('inventory_item_id=107');
        expect(data).to.contain('pfilter%5Btest%5D=1');
      });
    });

    describe('ORTB2 data', function () {
      it('should include IAB content data from ortb2', function () {
        const request = spec.buildRequests([bidRequests[5]], bidderRequestWithORTB)[0];
        const data = normalizeRequestData(request.data);
        expect(data).to.contain('pfilter%5Biab_content%5D=cat%3AIAB1-1%7CIAB1-2%7CIAB2-10');
        expect(data).to.contain('bcat=BSW1%2CBSW2');
        expect(data).to.contain('pcat=IAB3');
      });
    });

    describe('Floor price handling', function () {
      const getFloorResponse = {currency: 'EUR', floor: 5};
      let testBidRequest;

      it('should not include floorprice when neither getFloor nor pfilter.floorprice exist', function () {
        testBidRequest = deepClone(bidRequests[1]);
        const request = spec.buildRequests([testBidRequest], bidderRequestWithoutGdpr)[0];
        expect(request.data).to.not.contain('floorprice');
      });

      it('should use pfilter.floorprice when getFloor does not exist', function () {
        testBidRequest = deepClone(bidRequests[0]);
        testBidRequest.params.pfilter = { floorprice: 0.5 };
        const request = spec.buildRequests([testBidRequest], bidderRequestWithoutGdpr)[0];
        expect(request.data).to.contain('floorprice%5D=0.5');
      });

      it('should use getFloor() value when available and pfilter.floorprice is not set', function () {
        testBidRequest = deepClone(bidRequests[1]);
        testBidRequest.getFloor = () => getFloorResponse;
        const request = spec.buildRequests([testBidRequest], bidderRequestWithoutGdpr)[0];
        expect(request.data).to.contain('floorprice%5D=5');
      });

      it('should prioritize pfilter.floorprice over getFloor() when both exist', function () {
        testBidRequest = deepClone(bidRequests[0]);
        testBidRequest.getFloor = () => getFloorResponse;
        testBidRequest.params.pfilter = { floorprice: 0.35 };
        const request = spec.buildRequests([testBidRequest], bidderRequestWithoutGdpr)[0];
        expect(request.data).to.contain('floorprice%5D=0.35');
      });
    });
  });

  describe('Viewport size handling', () => {
    let bidderRequestWithoutGdpr;
    let bannerBidRequest;
    let videoBidRequest;

    beforeEach(function () {
      bidderRequestWithoutGdpr = deepClone(TEST_FIXTURES.bidderRequestWithoutGdpr);
      
      bannerBidRequest = {
        bidder: 'dspx',
        params: {
          placement: '6682',
          pfilter: { floorprice: 1000000 }
        },
        sizes: [[300, 250]],
        bidId: '30b31c1838de1e1',
        bidderRequestId: '22edbae2733bf61',
        auctionId: '1d1a030790a475',
        adUnitCode: 'testDiv1'
      };

      videoBidRequest = {
        bidder: 'dspx',
        params: {
          placement: '101',
          devMode: true
        },
        mediaTypes: {
          video: {
            playerSize: [640, 480],
            context: 'instream'
          }
        },
        bidId: '30b31c1838de1e4',
        bidderRequestId: '22edbae2733bf67',
        auctionId: '1d1a030790a478',
        adUnitCode: 'testDiv3'
      };
    });

    it('should include vpw and vph parameters in banner requests', function () {
      const request = spec.buildRequests([bannerBidRequest], bidderRequestWithoutGdpr)[0];
      expect(request.data).to.contain('vpw=');
      expect(request.data).to.contain('vph=');
    });

    it('should include vpw and vph parameters in video requests', function () {
      const request = spec.buildRequests([videoBidRequest], bidderRequestWithoutGdpr)[0];
      expect(request.data).to.contain('vpw=');
      expect(request.data).to.contain('vph=');
    });

    it('should use numeric values for viewport dimensions', function () {
      const request = spec.buildRequests([bannerBidRequest], bidderRequestWithoutGdpr)[0];
      const vpwMatch = request.data.match(/vpw=(\d+)/);
      const vphMatch = request.data.match(/vph=(\d+)/);
      
      expect(vpwMatch, 'vpw parameter should be present').to.not.be.null;
      expect(vphMatch, 'vph parameter should be present').to.not.be.null;
      expect(parseInt(vpwMatch[1]), 'vpw should be a number').to.be.a('number').and.be.above(0);
      expect(parseInt(vphMatch[1]), 'vph should be a number').to.be.a('number').and.be.above(0);
    });
  });

  describe('Google Topics handling', () => {
    let bidderRequest;
    let defaultBidRequest;

    beforeEach(() => {
      bidderRequest = {
        refererInfo: { referer: 'some_referrer.net' },
        gdprConsent: {
          consentString: 'BOJ/P2HOJ/P2HABABMAAAAAZ+A==',
          vendorData: {someData: 'value'},
          gdprApplies: true
        }
      };

      defaultBidRequest = {
        bidder: 'dspx',
        params: {
          placement: '6682',
          pfilter: {
            floorprice: 1000000,
            private_auction: 0,
            geo: { country: 'DE' }
          },
          bcat: 'IAB2,IAB4',
          dvt: 'desktop'
        },
        sizes: [[300, 250]],
        bidId: '30b31c1838de1e1',
        bidderRequestId: '22edbae2733bf61',
        auctionId: '1d1a030790a475',
        adUnitCode: 'testDiv1'
      };
    });

    afterEach(() => {
      config.resetConfig();
    });

    it('should include segtax, segclass, and segments for valid Google Topics data', () => {
      const GOOGLE_TOPICS_DATA = {
        ortb2: {
          user: {
            data: [
              {
                ext: {
                  segtax: 600,
                  segclass: 'v1',
                },
                segment: [
                  {id: '717'}, {id: '808'},
                ]
              }
            ]
          },
        },
      }
      config.setConfig(GOOGLE_TOPICS_DATA);
      const request = spec.buildRequests([defaultBidRequest], { ...bidderRequest, ...GOOGLE_TOPICS_DATA })[0];
      expect(request.data).to.contain('segtx=600&segcl=v1&segs=717%2C808');
    });

    it('should not include topics params when data is invalid', () => {
      const INVALID_TOPICS_DATA = {
        ortb2: {
          user: {
            data: [
              {
                segment: []
              },
              {
                segment: [{id: ''}]
              },
              {
                segment: [{id: null}]
              },
              {
                segment: [{id: 'dummy'}, {id: '123'}]
              },
              {
                ext: {
                  segtax: 600,
                  segclass: 'v1',
                },
                segment: [
                  {
                    name: 'dummy'
                  }
                ]
              },
            ]
          }
        }
      };

      config.setConfig(INVALID_TOPICS_DATA);
      const request = spec.buildRequests([defaultBidRequest], { ...bidderRequest, ...INVALID_TOPICS_DATA })[0];
      expect(request.data).to.not.contain('segtax');
      expect(request.data).to.not.contain('segclass');
      expect(request.data).to.not.contain('segments');
    });
  });

  describe('interpretResponse', function () {
    let serverResponse;
    let serverVideoResponse;
    let serverVideoResponseVastUrl;
    let expectedResponse;

    beforeEach(function () {
      serverResponse = {
      'body': {
        'cpm': 5000000,
        'crid': 100500,
        'width': '300',
        'height': '250',
        'type': 'sspHTML',
        'adTag': '<!-- test creative -->',
        'requestId': '220ed41385952a',
        'currency': 'EUR',
        'ttl': 60,
        'netRevenue': true,
        'zone': '6682',
        'adomain': ['bdomain']
      }
      };

      serverVideoResponse = {
      'body': {
        'cpm': 5000000,
        'crid': 100500,
        'width': '300',
        'height': '250',
        'vastXml': '{"reason":7001,"status":"accepted"}',
        'requestId': '220ed41385952a',
        'type': 'vast2',
        'currency': 'EUR',
        'ttl': 60,
        'netRevenue': true,
        'zone': '6682',
        'renderer': {id: 1, url: '//player.example.com', options: {}}
      }
      };

      serverVideoResponseVastUrl = {
      'body': {
        'cpm': 5000000,
        'crid': 100500,
        'width': '300',
        'height': '250',
        'requestId': '220ed41385952a',
        'type': 'vast2',
        'currency': 'EUR',
        'ttl': 60,
        'netRevenue': true,
        'zone': '6682',
        'vastUrl': 'https://local/vasturl1',
        'videoCacheKey': 'cache_123',
        'bid_appendix': {'someField': 'someValue'}
      }
      };

      expectedResponse = [{
      requestId: '23beaa6af6cdde',
      cpm: 0.5,
      width: 0,
      height: 0,
      creativeId: 100500,
      dealId: '',
      currency: 'EUR',
      netRevenue: true,
      ttl: 60,
      type: 'sspHTML',
      ad: '<!-- test creative -->',
      meta: {advertiserDomains: ['bdomain']},
    }, {
      requestId: '23beaa6af6cdde',
      cpm: 0.5,
      width: 0,
      height: 0,
      creativeId: 100500,
      dealId: '',
      currency: 'EUR',
      netRevenue: true,
      ttl: 300,
      type: 'vast2',
      vastXml: '{"reason":7001,"status":"accepted"}',
      mediaType: 'video',
      meta: {advertiserDomains: []},
      renderer: {}
    }, {
      requestId: '23beaa6af6cdde',
      cpm: 0.5,
      width: 0,
      height: 0,
      creativeId: 100500,
      dealId: '',
      currency: 'EUR',
      netRevenue: true,
      ttl: 60,
      type: 'vast2',
      vastUrl: 'https://local/vasturl1',
      videoCacheKey: 'cache_123',
      mediaType: 'video',
      meta: {advertiserDomains: []},
      someField: 'someValue'
      }];
    });

    describe('Banner responses', function () {
      it('should correctly interpret banner ad response', function () {
      const bidRequest = [{
        'method': 'GET',
        'url': ENDPOINT_URL,
        'data': {
          'bid_id': '30b31c1838de1e'
        }
      }];
      const result = spec.interpretResponse(serverResponse, bidRequest[0]);
      expect(Object.keys(result[0])).to.include.members(Object.keys(expectedResponse[0]));
      expect(result[0].meta.advertiserDomains.length).to.equal(1);
        expect(result[0].meta.advertiserDomains[0]).to.equal(expectedResponse[0].meta.advertiserDomains[0]);
      });
    });

    describe('Video responses', function () {
      it('should correctly interpret outstream video response with vastXml', function () {
      const bidRequest = [{
        'method': 'GET',
        'url': ENDPOINT_URL,
        'mediaTypes': {
          'video': {
            'playerSize': [640, 480],
            'context': 'outstream'
          }
        },
        'data': {
          'bid_id': '30b31c1838de1e'
        }
      }];
      const result = spec.interpretResponse(serverVideoResponse, bidRequest[0]);
      expect(Object.keys(result[0])).to.include.members(Object.keys(expectedResponse[1]));
        expect(result[0].meta.advertiserDomains.length).to.equal(0);
      });

      it('should correctly interpret instream video response with vastUrl', function () {
      const bidRequest = [{
        'method': 'GET',
        'url': ENDPOINT_URL,
        'mediaTypes': {
          'video': {
            'playerSize': [640, 480],
            'context': 'instream'
          }
        },
        'data': {
          'bid_id': '30b31c1838de1e'
        }
      }];
      const result = spec.interpretResponse(serverVideoResponseVastUrl, bidRequest[0]);
      expect(Object.keys(result[0])).to.include.members(Object.keys(expectedResponse[2]));
        expect(result[0].meta.advertiserDomains.length).to.equal(0);
      });
    });

    describe('Error handling', function () {
      it('should return empty array for empty response body', function () {
      const response = {
        body: {}
      };
      const result = spec.interpretResponse(response);
        expect(result.length).to.equal(0);
      });
    });
  });

  describe('getUserSyncs', function () {
    let serverResponses;

    beforeEach(function () {
      serverResponses = [{
        body: {
          requestId: '23beaa6af6cdde',
          cpm: 0.5,
          width: 0,
          height: 0,
          creativeId: 100500,
          dealId: '',
          currency: 'EUR',
          netRevenue: true,
          ttl: 300,
          type: 'sspHTML',
          ad: '<!-- test creative -->',
          userSync: {
            iframeUrl: ['anyIframeUrl?a=1'],
            imageUrl: ['anyImageUrl', 'anyImageUrl2']
          }
        }
      }];
    });

    describe('With valid server response', function () {
      it('should return an array', function () {
        expect(spec.getUserSyncs({ iframeEnabled: true })).to.be.an('array');
      });

      it('should return iframe sync when iframeEnabled is true', function () {
        const result = spec.getUserSyncs({ iframeEnabled: true }, serverResponses);
        expect(result.length).to.equal(1);
        expect(result[0]).to.have.property('type', 'iframe');
      });

      it('should include GDPR consent in iframe sync URL', function () {
        const [userSync] = spec.getUserSyncs({ iframeEnabled: true }, serverResponses, {consentString: 'anyString'});
        expect(userSync.url).to.equal('anyIframeUrl?a=1&gdpr_consent=anyString');
        expect(userSync.type).to.equal('iframe');
      });

      it('should include GDPR parameters in image sync URL', function () {
        const [userSync] = spec.getUserSyncs({ pixelEnabled: true }, serverResponses, {gdprApplies: true, consentString: 'anyString'});
        expect(userSync.url).to.equal('anyImageUrl?gdpr=1&gdpr_consent=anyString');
        expect(userSync.type).to.equal('image');
      });

      it('should return both iframe and image syncs when both are enabled', function () {
        const userSync = spec.getUserSyncs({ iframeEnabled: true, pixelEnabled: true }, serverResponses, {gdprApplies: true, consentString: 'anyString'});
        expect(userSync.length).to.equal(3);
        expect(userSync[0].url).to.equal('anyIframeUrl?a=1&gdpr=1&gdpr_consent=anyString');
        expect(userSync[0].type).to.equal('iframe');
        expect(userSync[1].url).to.equal('anyImageUrl?gdpr=1&gdpr_consent=anyString');
        expect(userSync[1].type).to.equal('image');
        expect(userSync[2].url).to.equal('anyImageUrl2?gdpr=1&gdpr_consent=anyString');
        expect(userSync[2].type).to.equal('image');
      });
    });

    describe('With passback response', function () {
      let passbackResponses;

      beforeEach(function () {
        passbackResponses = [{
          body: {
            reason: 8002,
            status: 'error',
            msg: 'passback',
          }
        }];
      });

      it('should return empty array for iframe sync', function () {
        expect(spec.getUserSyncs({ iframeEnabled: true })).to.be.an('array');
        expect(spec.getUserSyncs({ iframeEnabled: true }, passbackResponses).length).to.equal(0);
      });

      it('should return empty array for pixel sync', function () {
        expect(spec.getUserSyncs({ pixelEnabled: true })).to.be.an('array');
        expect(spec.getUserSyncs({ pixelEnabled: true }, passbackResponses).length).to.equal(0);
      });
    });
  });
});
