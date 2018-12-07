import * as R from 'ramda';
import { def } from './types';
import { MANAGED_ATTACHMENT_FILENAMES } from './constants';

export const createAttachment = def(
  'createAttachment :: String -> String -> String -> Attachment',
  (filename, encoding, content) => ({
    filename,
    encoding,
    content,
  })
);

export const createAttachmentManagedByMarker = def(
  'createAttachmentManagedByMarker :: PatchPath -> String -> Attachment',
  (markerName, content) =>
    createAttachment(
      // TODO: what about unknown filenames?
      MANAGED_ATTACHMENT_FILENAMES[markerName],
      'utf-8',
      content
    )
);

export const isAttachmentManagedByMarker = def(
  'isAttachmentManagedByMarker :: PatchPath -> Attachment -> Boolean',
  (markerName, attachment) =>
    R.propEq('filename', MANAGED_ATTACHMENT_FILENAMES[markerName], attachment)
);

export const getFilename = def(
  'getFilename :: Attachment -> String',
  R.prop('filename')
);

export const getContent = def(
  'getContent :: Attachment -> String',
  R.prop('content')
);

export const getEncoding = def(
  'getEncoding :: Attachment -> String',
  R.prop('encoding')
);
