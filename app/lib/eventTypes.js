const EVENT_TYPES = {
  'letter.created': {
    step: 1,
    label: 'Processing'
  },
  'letter.rendered_pdf': {
    step: 1,
    label: 'Processing'
  },
  'letter.rendered_thumbnails': {
    step: 1,
    label: 'Processing'
  },
  'letter.processed_for_delivery': {
    step: 2,
    label: 'Processed for delivery'
  },
  'letter.in_transit': {
    step: 3,
    label: 'In transit'
  },
  'letter.in_local_area': {
    step: 3,
    label: 'In local area'
  },
  'letter.re-routed': {
    step: 3,
    label: 'Re-routed'
  },
  'letter.returned_to_sender': {
    step: 3,
    label: 'Returned to sender'
  }
}

export default EVENT_TYPES
