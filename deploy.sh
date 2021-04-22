#!/bin/bash
#brunch build --production && rsync -a --delete --rsync-path="sudo rsync" --info=progress2 public/ l-a.site:/srv/skins.l-a.site/www/csic-hub-demo \
#    && rsync -a --delete --rsync-path="sudo rsync" --info=progress2 public/ l-a.site:/srv/csic.l-a.site/www/
brunch build --production && \
    rsync -a --delete --rsync-path="sudo rsync" --info=progress2 public/ csic.gbif.es:/srv/csic.gbif.es/www/ && \
    ssh csic.gbif.es sudo rsync -a --delete /srv/csic.gbif.es/www/ /srv/csic.gbif.es/www/csic-hub-demo/ && \
    curl -s https://csic.gbif.es/registros/headerFooter/clearCache && \
    curl -s https://csic.gbif.es/regiones/headerFooter/clearCache && \
    curl -s https://csic.gbif.es/especies/headerFooter/clearCache
